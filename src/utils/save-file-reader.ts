import type { Collectible } from '../types/collectible.ts';

type SaveFileImportResult = {
    collectedMap: Record<string, boolean>;
};

export const extractCollectedMapFromSaveFile = async (
    file: File,
    collectibles: Collectible[],
): Promise<SaveFileImportResult> => {
    if (!file.name.toLowerCase().endsWith('.sav')) {
        throw new Error('Please upload a .sav file.');
    }

    const saveBytes = new Uint8Array(await file.arrayBuffer());
    const collectedMap = scanCollectedMapFromSaveBytes(saveBytes, collectibles);
    const collectedCount = Object.values(collectedMap).filter(Boolean).length;

    if (collectedCount === 0) {
        throw new Error("This doesn't look like a CO:E33 save file.");
    }

    return { collectedMap };
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
