import ws from 'k6/ws';
import { Pinus, PinusEvents, Protocol } from './pinus/index.js';
import { check } from 'k6';

/**
 * Do something async, i.e. web socket stuff
 */
export function asyncGate(wsUrl, uid, ErrorCount, callback) {

    ws.connect(wsUrl, function (socket) {

        const pinus = new Pinus();
        // pinus.DEBUG_LOG = true;

        pinus.client = {
            sendBuffer(buffer) {
                // console.log('send buffer', buffer);
                socket.sendBinary(buffer.buffer);
            },
            isConnected() {
                return true;
            }
        }

        pinus.emiter = {
            emit(event, data) {
                // console.log('emit', event, data);
                switch (event) {
                    case PinusEvents.EVENT_HANDSHAKEERROR:
                        {
                            console.error('handshake error', data);
                            ErrorCount.add(1);
                        }
                        break;
                    case PinusEvents.EVENT_HANDSHAKEOVER:
                        {
                            check(null, {
                                "PINUS Gate 握手成功": true
                            });

                            if (pinus.heartbeatEnable()) {
                                // console.log('start timer for heartbeat');
                                socket.setInterval(() => {
                                    pinus.heartbeatCheck(0.1);
                                }, 100);
                            }

                            const sendData = Protocol.strencode(`{ "uid":"${uid}" }`);

                            pinus.request('gate.gateHandler.queryEntry', sendData, (byte) => {

                                const str = Protocol.strdecode(byte);
                                const data = JSON.parse(str);

                                check(null, {
                                    "PINUS Gate Entry 成功": data.code == 200
                                });

                                callback(`ws://${data.host}:${data.port}`);
                                socket.close();
                            });
                        }
                        break;
                    case PinusEvents.EVENT_BEENKICKED:
                        {
                            console.log('been kicked', data);
                            socket.close();
                        }
                        break;
                    case PinusEvents.EVENT_MESSAGE:
                        {
                            // console.log('message', data);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        socket.on('open', function open() {
            pinus.onOpen();
        });

        socket.on('binaryMessage', function (message) {
            pinus.onRecv(message);
        });

        socket.on('close', function () {
            pinus.onClose();
        });

        socket.on('error', function (e) {

            // 被踢出时可能触发 1005 错误
            if (e.error().includes('1005')) return;

            if (e.error() != "websocket: close sent") {
                console.error('asyncGate socket error', e);
                ErrorCount.add(1);
            }
        });
    });

}