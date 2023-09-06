export declare class Message {
    /**
     * Message protocol encode.
     *
     * @param  {Number} id            message id
     * @param  {Number} type          message type
     * @param  {Number} compressRoute whether compress route
     * @param  {Number|String} route  route code or route string
     * @param  {Buffer} msg           message body bytes
     * @return {Buffer}               encode result
     */
    static encode(id: number, type: number, compressRoute: number, route: number | string | Uint8Array, msg: Uint8Array, compressGzip?: number): Uint8Array;
    /**
     * Message protocol decode.
     *
     * @param  {Buffer|Uint8Array} buffer message bytes
     * @return {Object}            message object
     */
    static decode(buffer: string | ArrayBuffer): {
        id: number;
        type: number;
        compressRoute: number;
        route: number | string;
        body: Uint8Array;
        compressGzip: number;
    };
}
