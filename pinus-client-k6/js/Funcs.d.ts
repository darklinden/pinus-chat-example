export declare function copyArray(dest: Uint8Array, doffset: number, src: Uint8Array | string, soffset: number, length: number): void;
export declare function msgHasId(type: number): boolean;
export declare function msgHasRoute(type: number): boolean;
export declare function caculateMsgIdBytes(id: number): number;
export declare function encodeMsgFlag(type: number, compressRoute: number, buffer: Uint8Array, offset: number, compressGzip: number): number;
export declare function encodeMsgId(id: number, buffer: Uint8Array, offset: number): number;
export declare function encodeMsgRoute(compressRoute: number, route: number | string | Uint8Array, buffer: Uint8Array, offset: number): number;
export declare function encodeMsgBody(msg: Uint8Array, buffer: Uint8Array, offset: number): number;
export declare function timestr(): string;
export declare function log_bytes(title: string, bytes: Uint8Array): void;
