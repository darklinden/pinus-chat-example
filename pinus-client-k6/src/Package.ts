import { PKG_HEAD_BYTES } from "./Constants";
import { copyArray } from "./Funcs";

export class Package {
    static TYPE_HANDSHAKE = 1;
    static TYPE_HANDSHAKE_ACK = 2;
    static TYPE_HEARTBEAT = 3;
    static TYPE_DATA = 4;
    static TYPE_KICK = 5;

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
    static encode(type: number, body?: Uint8Array): Uint8Array {
        let length = body ? body.length : 0;
        let buffer = new Uint8Array(PKG_HEAD_BYTES + length);
        let index = 0;
        buffer[index++] = type & 0xff;
        buffer[index++] = (length >> 16) & 0xff;
        buffer[index++] = (length >> 8) & 0xff;
        buffer[index++] = length & 0xff;
        if (body) {
            copyArray(buffer, index, body, 0, length);
        }
        return buffer;
    }

    /**
     * Package protocol decode.
     * See encode for package format.
     *
     * @param  {Uint8Array} buffer byte array containing package content
     * @return {Object}           {type: package type, buffer: body byte array}
     */
    static decode(buffer: ArrayBuffer): { type: number, body?: Uint8Array | null } | { type: number, body?: Uint8Array | null }[] {
        let offset = 0;
        let bytes = new Uint8Array(buffer);
        let length = 0;
        let rs: { type: number, body?: Uint8Array | null }[] = [];
        while (offset < bytes.length) {
            let type = bytes[offset++];
            length = ((bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;
            let body = length ? new Uint8Array(length) : null;
            if (body) {
                copyArray(body, 0, bytes, offset, length);
            }
            offset += length;
            rs.push({ type: type, body: body });
        }
        return rs.length === 1 ? rs[0] : rs;
    }
}