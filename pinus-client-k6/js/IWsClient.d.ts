export interface IWsClient {
    sendBuffer(buffer: Uint8Array): void;
    get isConnected(): boolean;
    set isConnected(value: boolean);
}
