export declare enum PinusEvents {
    EVENT_CONNECTED = "pinus.connected",
    EVENT_CLOSED = "pinus.closed",
    EVENT_ERROR = "pinus.error",
    EVENT_HANDSHAKEERROR = "pinus.handshakeerror",
    EVENT_HANDSHAKEOVER = "pinus.handshakeover",
    EVENT_BEENKICKED = "pinus.beenkicked",
    EVENT_MESSAGE = "pinus.onmessage"
}
export interface IEventEmiter {
    emit(name: PinusEvents, data: any): void;
}
