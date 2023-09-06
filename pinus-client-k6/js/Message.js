import { MSG_FLAG_BYTES, MSG_ROUTE_CODE_BYTES, MSG_ROUTE_LEN_BYTES, MSG_COMPRESS_ROUTE_MASK, MSG_TYPE_MASK, MSG_COMPRESS_GZIP_MASK } from "./Constants";
import { msgHasId, caculateMsgIdBytes, msgHasRoute, encodeMsgFlag, encodeMsgId, encodeMsgRoute, encodeMsgBody, copyArray } from "./Funcs";
import { Protocol } from "./Protocol";
var Message = /** @class */ (function () {
    function Message() {
    }
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
    Message.encode = function (id, type, compressRoute, route, msg, compressGzip) {
        if (compressGzip === void 0) { compressGzip = 0; }
        // caculate message max length
        var idBytes = msgHasId(type) ? caculateMsgIdBytes(id) : 0;
        var msgLen = MSG_FLAG_BYTES + idBytes;
        if (msgHasRoute(type)) {
            if (compressRoute) {
                if (typeof route !== 'number') {
                    throw new Error('error flag for number route!');
                }
                msgLen += MSG_ROUTE_CODE_BYTES;
            }
            else {
                msgLen += MSG_ROUTE_LEN_BYTES;
                if (route) {
                    route = Protocol.strencode(route);
                    if (route.length > 255) {
                        throw new Error('route maxlength is overflow');
                    }
                    msgLen += route.length;
                }
            }
        }
        if (msg) {
            msgLen += msg.length;
        }
        var buffer = new Uint8Array(msgLen);
        var offset = 0;
        // add flag
        offset = encodeMsgFlag(type, compressRoute, buffer, offset, compressGzip);
        // add message id
        if (msgHasId(type)) {
            offset = encodeMsgId(id, buffer, offset);
        }
        // add route
        if (msgHasRoute(type)) {
            offset = encodeMsgRoute(compressRoute, route, buffer, offset);
        }
        // add body
        if (msg) {
            offset = encodeMsgBody(msg, buffer, offset);
        }
        return buffer;
    };
    /**
     * Message protocol decode.
     *
     * @param  {Buffer|Uint8Array} buffer message bytes
     * @return {Object}            message object
     */
    Message.decode = function (buffer) {
        var bytes = typeof buffer == 'string' ? new TextEncoder().encode(buffer) : new Uint8Array(buffer);
        var bytesLen = bytes.length || bytes.byteLength;
        var offset = 0;
        var id = 0;
        var route = -1;
        // parse flag
        var flag = bytes[offset++];
        var compressRoute = flag & MSG_COMPRESS_ROUTE_MASK;
        var type = (flag >> 1) & MSG_TYPE_MASK;
        var compressGzip = (flag >> 4) & MSG_COMPRESS_GZIP_MASK;
        // parse id
        if (msgHasId(type)) {
            var m = 0;
            var i = 0;
            do {
                m = parseInt(bytes[offset] + '');
                id += (m & 0x7f) << (7 * i);
                offset++;
                i++;
            } while (m >= 128);
        }
        // parse route
        if (msgHasRoute(type)) {
            if (compressRoute) {
                route = (bytes[offset++]) << 8 | bytes[offset++];
            }
            else {
                var routeLen = bytes[offset++];
                if (routeLen) {
                    var ra = new Uint8Array(routeLen);
                    copyArray(ra, 0, bytes, offset, routeLen);
                    route = Protocol.strdecode(ra);
                }
                else {
                    route = '';
                }
                offset += routeLen;
            }
        }
        // parse body
        var bodyLen = bytesLen - offset;
        var body = new Uint8Array(bodyLen);
        copyArray(body, 0, bytes, offset, bodyLen);
        return {
            id: id,
            type: type,
            compressRoute: compressRoute,
            route: route,
            body: body,
            compressGzip: compressGzip
        };
    };
    return Message;
}());
export { Message };
