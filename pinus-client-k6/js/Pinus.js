import { ERR_CONNECT_TIMEOUT } from './Constants';
import { timestr, log_bytes } from './Funcs';
import { PinusEvents as Events } from './IEventEmiter';
import { Message } from './Message';
import { MessageType } from './MessageType';
import { Package } from './Package';
import { Protocol as Protocol_ } from './Protocol';
export var PinusEvents = Events;
export var Protocol = Protocol_;
var JS_WS_CLIENT_TYPE = 'ws';
var JS_WS_CLIENT_VERSION = '0.0.5';
var RES_OK = 200;
var RES_FAIL = 500;
var RES_OLD_CLIENT = 501;
var Pinus = /** @class */ (function () {
    function Pinus() {
        this.DEBUG_LOG = false;
        // --- EventTarget begin ---
        this._emiter = null;
        // --- EventTarget end --- 
        this._heartbeatPassed = 0;
        this._heartbeatInterval = 0;
        this._heartbeatTimeout = 0;
        this._shouldHeartbeat = false;
        this._requestId = 1;
        // Map from request id to route
        this._requestRouteMap = {};
        // callback from request id
        this._requestCallbackMap = {};
        this._handshakeBuffer = {
            sys: {
                type: JS_WS_CLIENT_TYPE,
                version: JS_WS_CLIENT_VERSION,
                rsa: {}
            },
            user: {}
        };
        this._routeMap = null;
        this._routeMapBack = null;
        this._client = null;
        this._messageHandlers = null;
    }
    Object.defineProperty(Pinus.prototype, "emiter", {
        set: function (value) {
            this._emiter = value;
        },
        enumerable: false,
        configurable: true
    });
    Pinus.prototype.event = function (name, data) {
        if (data === void 0) { data = null; }
        if (this._emiter) {
            this._emiter.emit(name, data);
        }
    };
    Pinus.prototype.heartbeatInterval = function () {
        return this._heartbeatInterval;
    };
    Pinus.prototype.heartbeatTimeout = function () {
        return this._heartbeatTimeout;
    };
    Pinus.prototype.heartbeatEnable = function () {
        return this._heartbeatInterval > 0;
    };
    Object.defineProperty(Pinus.prototype, "uniqueRequestId", {
        get: function () {
            this._requestId++;
            if (this._requestId >= 40000)
                this._requestId = 1;
            return this._requestId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pinus.prototype, "client", {
        get: function () {
            return this._client;
        },
        set: function (value) {
            this._client = value;
        },
        enumerable: false,
        configurable: true
    });
    // --- Socket begin ---
    Pinus.prototype.onOpen = function () {
        var _a;
        this.event(PinusEvents.EVENT_CONNECTED);
        var d = JSON.stringify(this._handshakeBuffer);
        var obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(d));
        this.DEBUG_LOG && log_bytes('onOpen', obj);
        (_a = this.client) === null || _a === void 0 ? void 0 : _a.sendBuffer(obj);
    };
    Pinus.prototype.onRecv = function (data) {
        this.processPackage(Package.decode(data));
        // new package arrived, update the heartbeat timeout
        this.renewHeartbeatTimeout();
    };
    Pinus.prototype.onErr = function (err) {
        this.event(PinusEvents.EVENT_ERROR, err);
    };
    Pinus.prototype.onClose = function () {
        this.event(PinusEvents.EVENT_CLOSED);
    };
    Pinus.prototype.connectTimeout = function () {
        this.event(PinusEvents.EVENT_ERROR, ERR_CONNECT_TIMEOUT);
    };
    // --- Socket end ---
    Pinus.prototype.renewHeartbeatTimeout = function () {
        this._heartbeatPassed = 0;
    };
    Pinus.prototype.handshake = function (data) {
        var _a;
        var d = JSON.parse(Protocol.strdecode(data));
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
            this._heartbeatInterval = d.sys.heartbeat; // heartbeat interval
            this._heartbeatTimeout = this._heartbeatInterval * 2; // max heartbeat timeout
        }
        else {
            this._heartbeatInterval = 0;
            this._heartbeatTimeout = 0;
        }
        if (d && d.sys) {
            var dict = d.sys.dict;
            // Init compress dict
            if (dict) {
                this._routeMap = {};
                this._routeMapBack = {};
                for (var key in dict) {
                    if (Object.prototype.hasOwnProperty.call(dict, key)) {
                        var value = dict[key];
                        this._routeMap[key] = value;
                        this._routeMapBack[value] = key;
                    }
                }
            }
        }
        this._routeMap = this._routeMap || {};
        this._routeMapBack = this._routeMapBack || {};
        (_a = this.client) === null || _a === void 0 ? void 0 : _a.sendBuffer(Package.encode(Package.TYPE_HANDSHAKE_ACK));
        this.event(PinusEvents.EVENT_HANDSHAKEOVER);
    };
    Pinus.prototype.heartbeat = function (data) {
        if (!this._heartbeatInterval) {
            // no heartbeat
            return;
        }
        this._shouldHeartbeat = true;
    };
    Pinus.prototype.heartbeatCheck = function (dt) {
        var _a;
        if (!this._heartbeatInterval)
            return;
        if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.isConnected)) {
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
    };
    Pinus.prototype.onData = function (data) {
        var msg = this.decode(data);
        if (!msg) {
            console.error('pinus onData decode failed');
            return;
        }
        else {
            this.DEBUG_LOG && console.log(timestr(), 'recv', msg);
        }
        if (msg.id) {
            // if have a id then find the callback function with the request
            var cb = this._requestCallbackMap[msg.id];
            delete this._requestCallbackMap[msg.id];
            cb && cb(msg.body);
            return;
        }
        // server push message
        this.event(PinusEvents.EVENT_MESSAGE, msg);
    };
    Pinus.prototype.onKick = function (data) {
        data = JSON.parse(Protocol.strdecode(data));
        this.event(PinusEvents.EVENT_BEENKICKED, data);
    };
    Object.defineProperty(Pinus.prototype, "messageHandlers", {
        get: function () {
            if (!this._messageHandlers) {
                this._messageHandlers = {};
                this._messageHandlers[Package.TYPE_HANDSHAKE] = this.handshake.bind(this);
                this._messageHandlers[Package.TYPE_HEARTBEAT] = this.heartbeat.bind(this);
                this._messageHandlers[Package.TYPE_DATA] = this.onData.bind(this);
                this._messageHandlers[Package.TYPE_KICK] = this.onKick.bind(this);
            }
            return this._messageHandlers;
        },
        enumerable: false,
        configurable: true
    });
    Pinus.prototype.processPackage = function (msgs) {
        if (Array.isArray(msgs)) {
            for (var i = 0; i < msgs.length; i++) {
                var msg = msgs[i];
                var func = this.messageHandlers[msg.type];
                if (func)
                    func(msg.body || null);
            }
        }
        else {
            var func = this.messageHandlers[msgs.type];
            if (func)
                func(msgs.body || null);
        }
    };
    Pinus.prototype.decode = function (data) {
        if (data == null)
            return null;
        // decode
        var msg = Message.decode(data);
        if (msg.id > 0) {
            var r = this._requestRouteMap[msg.id];
            delete this._requestRouteMap[msg.id];
            if (r) {
                msg.route = r;
            }
            else {
                return null;
            }
        }
        var route = null;
        // Decompose route from dict
        if (msg.compressRoute) {
            route = this._routeMapBack[msg.route] || null;
            if (!route)
                return null;
            msg.route = route;
        }
        else {
            route = msg.route;
        }
        return msg;
    };
    Pinus.prototype.encode = function (reqId, route, msg) {
        var type = reqId ? MessageType.REQUEST : MessageType.NOTIFY;
        var compressRoute = 0;
        if (this._routeMap[route]) {
            route = this._routeMap[route];
            compressRoute = 1;
        }
        return Message.encode(reqId, type, compressRoute, route, msg);
    };
    Pinus.prototype._sendMessage = function (reqId, route, msg) {
        var _a;
        this.DEBUG_LOG && log_bytes('sendMessage ' + reqId + ' ' + route, msg);
        var message = this.encode(reqId, route, msg);
        this.DEBUG_LOG && log_bytes('message', message);
        var packet = Package.encode(Package.TYPE_DATA, message);
        this.DEBUG_LOG && log_bytes('packet', packet);
        (_a = this.client) === null || _a === void 0 ? void 0 : _a.sendBuffer(packet);
    };
    Pinus.prototype.request = function (route, msg, cb) {
        route = route || msg.route;
        if (!route) {
            return;
        }
        var reqId = this.uniqueRequestId;
        this._sendMessage(reqId, route, msg);
        this._requestCallbackMap[reqId] = cb;
        this._requestRouteMap[reqId] = route;
    };
    Pinus.prototype.notify = function (route, msg) {
        this._sendMessage(0, route, msg);
    };
    return Pinus;
}());
export { Pinus };
