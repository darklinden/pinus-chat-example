export declare class Package {
    static TYPE_HANDSHAKE: number;
    static TYPE_HANDSHAKE_ACK: number;
    static TYPE_HEARTBEAT: number;
    static TYPE_DATA: number;
    static TYPE_KICK: number;
    /**
     * Package protocol encode.
     *
     * Pomelo package format:
     * +------+-------------+------------------+
     * | type | body length |       body       |
     * +------+-------------+------------------+
     *
     * Head: 4bytes
     *   0: package type,
     *      1 - handshake,
     *      2 - handshake ack,
     *      3 - heartbeat,
     *      4 - data
     *      5 - kick
     *   1 - 3: big-endian body length
     * Body: body length bytes
     *
     * @param  {Number}    type   package type
     * @param  {Uint8Array} body   body content in bytes
     * @return {Uint8Array}        new byte array that contains encode result
     */
    static encode(type: number, body?: Uint8Array): Uint8Array;
    /**
     * Package protocol decode.
     * See encode for package format.
     *
     * @param  {Uint8Array} buffer byte array containing package content
     * @return {Object}           {type: package type, buffer: body byte array}
     */
    static decode(buffer: ArrayBuffer): {
        type: number;
        body?: Uint8Array | null;
    } | {
        type: number;
        body?: Uint8Array | null;
    }[];
}
