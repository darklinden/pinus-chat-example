import { MSG_COMPRESS_GZIP_ENCODE_MASK, MSG_FLAG_BYTES, MSG_ROUTE_CODE_MAX } from "./Constants";
import { MessageType } from "./MessageType";
export function copyArray(dest, doffset, src, soffset, length) {
    // Uint8Array
    if (typeof src == 'string') {
        for (var index = 0; index < length; index++) {
            dest[doffset++] = parseInt(src[soffset++]);
        }
    }
    else {
        for (var index = 0; index < length; index++) {
            dest[doffset++] = src[soffset++];
        }
    }
}
export function msgHasId(type) {
    return type === MessageType.REQUEST || type === MessageType.RESPONSE;
}
export function msgHasRoute(type) {
    return type === MessageType.REQUEST || type === MessageType.NOTIFY ||
        type === MessageType.PUSH;
}
export function caculateMsgIdBytes(id) {
    var len = 0;
    do {
        len += 1;
        id >>= 7;
    } while (id > 0);
    return len;
}
export function encodeMsgFlag(type, compressRoute, buffer, offset, compressGzip) {
    if (type !== MessageType.REQUEST && type !== MessageType.NOTIFY &&
        type !== MessageType.RESPONSE && type !== MessageType.PUSH) {
        throw new Error('unkonw message type: ' + type);
    }
    buffer[offset] = (type << 1) | (compressRoute ? 1 : 0);
    if (compressGzip) {
        buffer[offset] = buffer[offset] | MSG_COMPRESS_GZIP_ENCODE_MASK;
    }
    return offset + MSG_FLAG_BYTES;
}
export function encodeMsgId(id, buffer, offset) {
    do {
        var tmp = id % 128;
        var next = Math.floor(id / 128);
        if (next !== 0) {
            tmp = tmp + 128;
        }
        buffer[offset++] = tmp;
        id = next;
    } while (id !== 0);
    return offset;
}
export function encodeMsgRoute(compressRoute, route, buffer, offset) {
    if (compressRoute) {
        if (typeof route == 'number' && route > MSG_ROUTE_CODE_MAX) {
            throw new Error('route number is overflow');
        }
        buffer[offset++] = (route >> 8) & 0xff;
        buffer[offset++] = route;
    }
    else {
        if (route) {
            buffer[offset++] = route.length & 0xff;
            copyArray(buffer, offset, route, 0, route.length);
            offset += route.length;
        }
        else {
            buffer[offset++] = 0;
        }
    }
    return offset;
}
export function encodeMsgBody(msg, buffer, offset) {
    copyArray(buffer, offset, msg, 0, msg.length);
    return offset + msg.length;
}
export function timestr() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var ms = "00" + date.getMilliseconds();
    return '[' + hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2) + '.' + ms.slice(-3) + '] ';
}
export function log_bytes(title, bytes) {
    var str = " <bytes len: " + bytes.length + ' ';
    str += '[';
    for (var i = 0; i < bytes.length; i++) {
        if (i > 0) {
            str += ' ';
        }
        var tmp = ('0' + bytes[i].toString(16));
        str += tmp.length > 2 ? tmp.substring(tmp.length - 2) : tmp;
    }
    str += ']>';
    console.log(timestr(), title, str);
}
