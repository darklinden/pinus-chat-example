import { ERR_CONNECT_TIMEOUT } from './Constants';
import { timestr, log_bytes } from './Funcs';
import { IEventEmiter, PinusEvents as Events } from './IEventEmiter';
import { IWsClient } from './IWsClient';
import { Message } from './Message';
import { MessageType } from './MessageType';
import { Package } from './Package';
import { Protocol as Protocol_ } from './Protocol';


export type PinusEvents = Events;
export const PinusEvents = Events;
export type Protocol = Protocol_;
export const Protocol = Protocol_;

const JS_WS_CLIENT_TYPE = 'ws';
const JS_WS_CLIENT_VERSION = '0.0.5';
const RES_OK = 200;
const RES_FAIL = 500;
const RES_OLD_CLIENT = 501;

export interface IHandshakeBuffer {
    sys: {
        type: string,
        version: string,
        rsa: any
    };
    user: any;
}

export class Pinus {

    public DEBUG_LOG = false;

    // --- EventTarget begin ---
    private _emiter: IEventEmiter | null = null;
    public set emiter(value: IEventEmiter | null) {
        this._emiter = value;
    }
    protected event(name: PinusEvents, data: any = null) {
        if (this._emiter) {
            this._emiter.emit(name, data);
        }
    }
    // --- EventTarget end --- 

    protected _heartbeatPassed: number = 0;
    protected _heartbeatInterval: number = 0;
    protected _heartbeatTimeout: number = 0;
    protected _shouldHeartbeat: boolean = false;

    public heartbeatInterval(): number {
        return this._heartbeatInterval;
    }

    public heartbeatTimeout(): number {
        return this._heartbeatTimeout;
    }

    public heartbeatEnable(): boolean {
        return this._heartbeatInterval > 0;
    }

    protected _requestId: number = 1;
    public get uniqueRequestId(): number {
        this._requestId++;
        if (this._requestId >= 40000) this._requestId = 1;
        return this._requestId;
    }

    // Map from request id to route
    protected _requestRouteMap: { [key: number]: number | string } = {};
    // callback from request id
    protected _requestCallbackMap: { [key: number]: (data: any) => void } = {};

    protected _handshakeBuffer: IHandshakeBuffer = {
        sys: {
            type: JS_WS_CLIENT_TYPE,
            version: JS_WS_CLIENT_VERSION,
            rsa: {}
        },
        user: {}
    };

    protected _routeMap: { [key: string]: number } | null = null;
    protected _routeMapBack: { [key: number]: string } | null = null;

    protected _client: IWsClient | null = null;
    public set client(value: IWsClient | null) {
        this._client = value;
    }
    public get client(): IWsClient | null {
        return this._client;
    }

    // --- Socket begin ---
    public onOpen() {
        this.event(PinusEvents.EVENT_CONNECTED);
        let d = JSON.stringify(this._handshakeBuffer)
        let obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(d));
        this.DEBUG_LOG && log_bytes('onOpen', obj);
        this.client?.sendBuffer(obj);
    }

    public onRecv(data: any) {
        this.processPackage(Package.decode(data));

        // new package arrived, update the heartbeat timeout
        this.renewHeartbeatTimeout();
    }

    public onErr(err: any) {
        this.event(PinusEvents.EVENT_ERROR, err);
    }

    public onClose() {
        this.event(PinusEvents.EVENT_CLOSED);
    }

    public connectTimeout() {
        this.event(PinusEvents.EVENT_ERROR, ERR_CONNECT_TIMEOUT);
    }

    // --- Socket end ---

    protected renewHeartbeatTimeout() {
        this._heartbeatPassed = 0;
    }

    protected handshake(data: ArrayBuffer | null) {
        const d: { code: number, sys: { heartbeat: number, dict: any } } = JSON.parse(Protocol.strdecode(data));
        this.DEBUG_LOG && console.log(timestr(), 'handshake', d);
        if (d && d.code === RES_OLD_CLIENT) {
            this.event(PinusEvents.EVENT_HANDSHAKEERROR);
            return;
        }

        if (d && d.code !== RES_OK) {
            this.event(PinusEvents.EVENT_HANDSHAKEERROR);
            return;
        }

        if (d && d.sys && d.sys.heartbeat) {
            this._heartbeatInterval = d.sys.heartbeat;              // heartbeat interval
            this._heartbeatTimeout = this._heartbeatInterval * 2;   // max heartbeat timeout
        } else {
            this._heartbeatInterval = 0;
            this._heartbeatTimeout = 0;
        }

        if (d && d.sys) {
            const dict = d.sys.dict;

            // Init compress dict
            if (dict) {
                this._routeMap = {};
                this._routeMapBack = {};
                for (const key in dict) {
                    if (Object.prototype.hasOwnProperty.call(dict, key)) {
                        const value: number = dict[key];
                        this._routeMap[key] = value;
                        this._routeMapBack[value] = key;
                    }
                }
            }
        }

        this._routeMap = this._routeMap || {};
        this._routeMapBack = this._routeMapBack || {};

        this.client?.sendBuffer(Package.encode(Package.TYPE_HANDSHAKE_ACK));
        this.event(PinusEvents.EVENT_HANDSHAKEOVER);
    }

    protected heartbeat(data: ArrayBuffer | null) {
        if (!this._heartbeatInterval) {
            // no heartbeat
            return;
        }

        this._shouldHeartbeat = true;
    }

    public heartbeatCheck(dt: number) {
        if (!this._heartbeatInterval) return;

        if (!this.client?.isConnected) {
            this._heartbeatPassed = 0;
            return;
        }

        this._heartbeatPassed += dt;

        if (this._shouldHeartbeat) {
            if (this._heartbeatPassed > this._heartbeatInterval) {
                this.client.sendBuffer(Package.encode(Package.TYPE_HEARTBEAT));
                this.renewHeartbeatTimeout();
            }
            return;
        }

        if (this._heartbeatPassed > this._heartbeatTimeout) {
            console.error('pinus server heartbeat timeout');
            this.onErr('heartbeat timeout');
        }
    }

    protected onData(data: ArrayBuffer | null) {
        const msg = this.decode(data);

        if (!msg) {
            console.error('pinus onData decode failed');
            return;
        }
        else {
            this.DEBUG_LOG && console.log(timestr(), 'recv', msg);
        }

        if (msg.id) {
            // if have a id then find the callback function with the request
            let cb = this._requestCallbackMap[msg.id];
            delete this._requestCallbackMap[msg.id];
            cb && cb(msg.body);
            return;
        }

        // server push message
        this.event(PinusEvents.EVENT_MESSAGE, msg);
    }

    onKick(data: ArrayBuffer | null) {
        data = JSON.parse(Protocol.strdecode(data));
        this.event(PinusEvents.EVENT_BEENKICKED, data);
    }

    protected _messageHandlers: { [key: number]: (data: ArrayBuffer | null) => void } | null = null;
    protected get messageHandlers(): { [key: number]: (data: ArrayBuffer | null) => void } {
        if (!this._messageHandlers) {
            this._messageHandlers = {};
            this._messageHandlers[Package.TYPE_HANDSHAKE] = this.handshake.bind(this);
            this._messageHandlers[Package.TYPE_HEARTBEAT] = this.heartbeat.bind(this);
            this._messageHandlers[Package.TYPE_DATA] = this.onData.bind(this);
            this._messageHandlers[Package.TYPE_KICK] = this.onKick.bind(this);
        }
        return this._messageHandlers;
    }

    protected processPackage(msgs: { type: number, body?: Uint8Array | null } | { type: number, body?: Uint8Array | null }[]) {
        if (Array.isArray(msgs)) {
            for (let i = 0; i < msgs.length; i++) {
                let msg = msgs[i];
                const func = this.messageHandlers[msg.type];
                if (func) func(msg.body || null);
            }
        } else {
            const func = this.messageHandlers[msgs.type];
            if (func) func(msgs.body || null);
        }
    }

    protected decode(data: string | ArrayBuffer | null): {
        id: number,
        route: number | string,
        body: any,
    } | null {

        if (data == null) return null;

        // decode
        const msg = Message.decode(data);

        if (msg.id > 0) {
            const r = this._requestRouteMap[msg.id];
            delete this._requestRouteMap[msg.id];
            if (r) {
                msg.route = r;
            }
            else {
                return null;
            }
        }

        let route: string | null = null;

        // Decompose route from dict
        if (msg.compressRoute) {
            route = this._routeMapBack![msg.route as number] || null;
            if (!route) return null;

            msg.route = route;
        }
        else {
            route = msg.route as string;
        }

        return msg;
    }

    protected encode(reqId: number, route: number | string, msg: Uint8Array): Uint8Array {
        let type = reqId ? MessageType.REQUEST : MessageType.NOTIFY;

        let compressRoute = 0;
        if (this._routeMap![route as string]) {
            route = this._routeMap![route as string];
            compressRoute = 1;
        }

        return Message.encode(reqId, type, compressRoute, route, msg);
    }

    protected _sendMessage(reqId: number, route: number | string, msg: any): void {
        this.DEBUG_LOG && log_bytes('sendMessage ' + reqId + ' ' + route, msg);
        const message = this.encode(reqId, route, msg);
        this.DEBUG_LOG && log_bytes('message', message);
        const packet = Package.encode(Package.TYPE_DATA, message);
        this.DEBUG_LOG && log_bytes('packet', packet);
        this.client?.sendBuffer(packet);
    }

    public request(route: string, msg: any, cb: (data: any) => void) {

        route = route || msg.route;
        if (!route) {
            return;
        }

        const reqId = this.uniqueRequestId;

        this._sendMessage(reqId, route, msg);

        this._requestCallbackMap[reqId] = cb;
        this._requestRouteMap[reqId] = route;
    }

    public notify(route: number | string, msg: any): void {
        this._sendMessage(0, route, msg);
    }
}