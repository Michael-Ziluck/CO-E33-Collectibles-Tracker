declare module 'uesave-wasm/uesave_wasm_bg.js' {
    export function __wbg_set_wasm(wasm: WebAssembly.Exports): void;
    export function __wbg_alert_c442b3d5cb6469dc(arg0: number, arg1: number): void;
    export function gsav_to_json_str(sav: Uint8Array): string;
}
