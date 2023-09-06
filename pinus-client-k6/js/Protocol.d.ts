export declare class Protocol {
    /**
     * pomele client encode
     * id message id;
     * route message route
     * msg message body
     * socketio current support string
     */
    static strencode(str: string): Uint8Array;
    /**
     * client decode
     * msg String data
     * return Message Object
     */
    static strdecode(buffer: ArrayBuffer | null): string;
}
