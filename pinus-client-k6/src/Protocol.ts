import { copyArray } from "./Funcs";

export class Protocol {

    /**
     * pomele client encode
     * id message id;
     * route message route
     * msg message body
     * socketio current support string
     */
    static strencode(str: string): Uint8Array {
        let byteArray = new Uint8Array(str.length * 3);
        let offset = 0;
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);
            let codes: number[];
            if (charCode <= 0x7f) {
                codes = [charCode];
            } else if (charCode <= 0x7ff) {
                codes = [0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f)];
            } else {
                codes = [0xe0 | (charCode >> 12), 0x80 | ((charCode & 0xfc0) >> 6), 0x80 | (charCode & 0x3f)];
            }
            for (let j = 0; j < codes.length; j++) {
                byteArray[offset] = codes[j];
                ++offset;
            }
        }
        let _buffer = new Uint8Array(offset);
        copyArray(_buffer, 0, byteArray, 0, offset);
        return _buffer;
    }

    /**
     * client decode
     * msg String data
     * return Message Object
     */
    static strdecode(buffer: ArrayBuffer | null): string {
        if (buffer == null) return '';

        let bytes = new Uint8Array(buffer);
        let array: number[] = [];
        let offset = 0;
        let charCode = 0;
        let end = bytes.length;
        while (offset < end) {
            if (bytes[offset] < 128) {
                charCode = bytes[offset];
                offset += 1;
            } else if (bytes[offset] < 224) {
                charCode = ((bytes[offset] & 0x1f) << 6) + (bytes[offset + 1] & 0x3f);
                offset += 2;
            } else {
                charCode = ((bytes[offset] & 0x0f) << 12) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
                offset += 3;
            }
            array.push(charCode);
        }
        return String.fromCharCode.apply(null, array);
    }
}