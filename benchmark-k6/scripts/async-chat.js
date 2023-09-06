import ws from 'k6/ws';
import { Pinus, PinusEvents, Protocol } from './pinus/index.js';
import { check } from 'k6';

export function asyncChat(wsUrl, uid, ErrorCount, callback) {

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
                                "PINUS Chat 握手成功": true
                            });

                            if (pinus.heartbeatEnable()) {
                                // console.log('start timer for heartbeat');
                                socket.setInterval(() => {
                                    pinus.heartbeatCheck(0.1);
                                }, 100);
                            }

                            const sendData = Protocol.strencode(`{"rid": "1", "username": "${uid}"}`);

                            pinus.request('connector.entryHandler.enter', sendData, (byte) => {
                                // 消息回调
                                const str = Protocol.strdecode(byte);
                                const data = JSON.parse(str);

                                // console.log('PINUS Chat 返回', str);

                                check(null, {
                                    "PINUS Chat enter 成功": data.users != null && data.users.length > 0
                                });

                                callback(pinus, socket, data['users']);
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
                console.error('asyncChat socket error', e);
                ErrorCount.add(1);
            }
        });
    });
}