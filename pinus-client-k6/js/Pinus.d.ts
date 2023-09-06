import { IEventEmiter, PinusEvents as Events } from './IEventEmiter';
import { IWsClient } from './IWsClient';
import { Protocol as Protocol_ } from './Protocol';
export type PinusEvents = Events;
export declare const PinusEvents: typeof Events;
export type Protocol = Protocol_;
export declare const Protocol: typeof Protocol_;
export interface IHandshakeBuffer {
    sys: {
        type: string;
        version: string;
        rsa: any;
    };
    user: any;
}
export declare class Pinus {
    DEBUG_LOG: boolean;
    private _emiter;
    set emiter(value: IEventEmiter | null);
    protected event(name: PinusEvents, data?: any): void;
    protected _heartbeatPassed: number;
    protected _heartbeatInterval: number;
    protected _heartbeatTimeout: number;
    protected _shouldHeartbeat: boolean;
    heartbeatInterval(): number;
    heartbeatTimeout(): number;
    heartbeatEnable(): boolean;
    protected _requestId: number;
    get uniqueRequestId(): number;
    protected _requestRouteMap: {
        [key: number]: number | string;
    };
    protected _requestCallbackMap: {
        [key: number]: (data: any) => void;
    };
    protected _handshakeBuffer: IHandshakeBuffer;
    protected _routeMap: {
        [key: string]: number;
    } | null;
    protected _routeMapBack: {
        [key: number]: string;
    } | null;
    protected _client: IWsClient | null;
    set client(value: IWsClient | null);
    get client(): IWsClient | null;
    onOpen(): void;
    onRecv(data: any): void;
    onErr(err: any): void;
    onClose(): void;
    connectTimeout(): void;
    protected renewHeartbeatTimeout(): void;
    protected handshake(data: ArrayBuffer | null): void;
    protected heartbeat(data: ArrayBuffer | null): void;
    heartbeatCheck(dt: number): void;
    protected onData(data: ArrayBuffer | null): void;
    onKick(data: ArrayBuffer | null): void;
    protected _messageHandlers: {
        [key: number]: (data: ArrayBuffer | null) => void;
    } | null;
    protected get messageHandlers(): {
        [key: number]: (data: ArrayBuffer | null) => void;
    };
    protected processPackage(msgs: {
        type: number;
        body?: Uint8Array | null;
    } | {
        type: number;
        body?: Uint8Array | null;
    }[]): void;
    protected decode(data: string | ArrayBuffer | null): {
        id: number;
        route: number | string;
        body: any;
    } | null;
    protected encode(reqId: number, route: number | string, msg: Uint8Array): Uint8Array;
    protected _sendMessage(reqId: number, route: number | string, msg: any): void;
    request(route: string, msg: any, cb: (data: any) => void): void;
    notify(route: number | string, msg: any): void;
}
