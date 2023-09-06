export interface IWsClient {
    sendBuffer(buffer: Uint8Array): void;
    isConnected(): boolean;
}
