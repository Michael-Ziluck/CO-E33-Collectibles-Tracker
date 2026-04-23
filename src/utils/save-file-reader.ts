import wasmUrl from 'uesave-wasm/uesave_wasm_bg.wasm?url';
import {
    __wbg_alert_c442b3d5cb6469dc,
    __wbg_set_wasm,
    gsav_to_json_str,
} from 'uesave-wasm/uesave_wasm_bg.js';
import type { Collectible } from '../types/collectible.ts';

type SaveJson = {
    root?: {
        properties?: {
            InventoryItems_0?: {
                Map?: Array<{
                    key?: {
                        Name?: string;
                    };
                    value?: {
                        Int?: number;
                    };
                }>;
            };
        };
    };
};

type SaveFileImportResult = {
    collectedMap: Record<string, boolean>;
    warning: string | null;
};

let initPromise: Promise<void> | null = null;

const initUesave = async (): Promise<void> => {
    if (initPromise == null) {
        initPromise = (async () => {
            const imports = {
                './uesave_wasm_bg.js': {
                    __wbg_alert_c442b3d5cb6469dc,
                },
            } satisfies WebAssembly.Imports;

            const response = await fetch(wasmUrl);
            const wasm = await WebAssembly.instantiate(await response.arrayBuffer(), imports);
            __wbg_set_wasm(wasm.instance.exports);
        })();
    }

    return initPromise;
};

export const convertSaveFileToJson = async (file: File): Promise<SaveJson> => {
    if (!file.name.toLowerCase().endsWith('.sav')) {
        throw new Error('Please upload a .sav file.');
    }

    await initUesave();

    const saveBytes = new Uint8Array(await file.arrayBuffer());
    return JSON.parse(gsav_to_json_str(saveBytes)) as SaveJson;
};

export const extractCollectedMapFromSaveFile = async (
    file: File,
    collectibles: Collectible[],
): Promise<SaveFileImportResult> => {
    if (!file.name.toLowerCase().endsWith('.sav')) {
        throw new Error('Please upload a .sav file.');
    }

    const saveBytes = new Uint8Array(await file.arrayBuffer());

    try {
        await initUesave();
        const saveJson = JSON.parse(gsav_to_json_str(saveBytes)) as SaveJson;

        return {
            collectedMap: extractCollectedMapFromSaveJson(saveJson, collectibles),
            warning: null,
        };
    } catch (error) {
        const collectedMap = scanCollectedMapFromSaveBytes(saveBytes, collectibles);
        const collectedCount = Object.values(collectedMap).filter(Boolean).length;

        if (collectedCount === 0) {
            throw new Error(
                `Could not convert save file. ${error instanceof Error ? error.message : String(error)}`,
            );
        }

        return {
            collectedMap,
            warning: 'The save converter failed, so the app loaded progress by scanning the save file inventory keys.',
        };
    }
};

export const extractCollectedMapFromSaveJson = (
    saveJson: SaveJson,
    collectibles: Collectible[],
): Record<string, boolean> => {
    const inventoryItems = saveJson.root?.properties?.InventoryItems_0?.Map;

    if (!Array.isArray(inventoryItems)) {
        throw new Error("This doesn't look like a CO:E33 save file.");
    }

    const inventoryMap = new Map(
        inventoryItems
            .filter((item) => item.key?.Name != null)
            .map((item) => [item.key!.Name!.toLowerCase(), item.value?.Int ?? 0]),
    );

    return Object.fromEntries(
        collectibles.map((item) => [
            item.id,
            (inventoryMap.get(item.saveFileKey.toLowerCase()) ?? 0) !== 0,
        ]),
    );
};

const scanCollectedMapFromSaveBytes = (
    saveBytes: Uint8Array,
    collectibles: Collectible[],
): Record<string, boolean> =>
    Object.fromEntries(
        collectibles.map((item) => [
            item.id,
            containsBytes(saveBytes, encodeUtf8(item.saveFileKey))
                || containsBytes(saveBytes, encodeUtf16Le(item.saveFileKey)),
        ]),
    );

const textEncoder = new TextEncoder();

const encodeUtf8 = (value: string): Uint8Array => textEncoder.encode(value);

const encodeUtf16Le = (value: string): Uint8Array => {
    const bytes = new Uint8Array(value.length * 2);

    for (let index = 0; index < value.length; index += 1) {
        const code = value.charCodeAt(index);
        bytes[index * 2] = code & 0xff;
        bytes[index * 2 + 1] = code >> 8;
    }

    return bytes;
};

const containsBytes = (haystack: Uint8Array, needle: Uint8Array): boolean => {
    if (needle.length === 0 || needle.length > haystack.length) {
        return false;
    }

    const firstByte = needle[0];

    for (let haystackIndex = 0; haystackIndex <= haystack.length - needle.length; haystackIndex += 1) {
        if (haystack[haystackIndex] !== firstByte) {
            continue;
        }

        let matched = true;

        for (let needleIndex = 1; needleIndex < needle.length; needleIndex += 1) {
            if (haystack[haystackIndex + needleIndex] !== needle[needleIndex]) {
                matched = false;
                break;
            }
        }

        if (matched) {
            return true;
        }
    }

    return false;
};
