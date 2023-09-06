export var PinusEvents;
(function (PinusEvents) {
    PinusEvents["EVENT_CONNECTED"] = "pinus.connected";
    PinusEvents["EVENT_CLOSED"] = "pinus.closed";
    PinusEvents["EVENT_ERROR"] = "pinus.error";
    PinusEvents["EVENT_HANDSHAKEERROR"] = "pinus.handshakeerror";
    PinusEvents["EVENT_HANDSHAKEOVER"] = "pinus.handshakeover";
    PinusEvents["EVENT_BEENKICKED"] = "pinus.beenkicked";
    PinusEvents["EVENT_MESSAGE"] = "pinus.onmessage";
})(PinusEvents || (PinusEvents = {}));
