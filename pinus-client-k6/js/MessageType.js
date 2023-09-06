export var MessageType;
(function (MessageType) {
    MessageType[MessageType["REQUEST"] = 0] = "REQUEST";
    MessageType[MessageType["NOTIFY"] = 1] = "NOTIFY";
    MessageType[MessageType["RESPONSE"] = 2] = "RESPONSE";
    MessageType[MessageType["PUSH"] = 3] = "PUSH";
})(MessageType || (MessageType = {}));
