import { Counter } from "k6/metrics";
import { asyncGate } from "./async-gate.js";
import { asyncChat } from "./async-chat.js";
import { random_string } from "./random-string.js";
import { Protocol } from "./pinus/index.js";
import { check } from "k6";

let ErrorCount = new Counter("errors");

const CLIENT_COUNT = 1000;
const LIVE_TIME = 20;

export const options = {
    vus: CLIENT_COUNT,
    duration: LIVE_TIME + "s",
    thresholds: {
        errors: ["count<10"]
    }
};

const url = "ws://127.0.0.1:3014"
const SINGLE_TIMEOUT = 10;

export default function () {

    const uid = '' + __VU;
    asyncGate(url, uid, ErrorCount, (connectorUrl) => {
        asyncChat(connectorUrl, uid, ErrorCount, (pinus, socket) => {

            let timeout = 0;

            socket.setInterval(() => {

                if (timeout > SINGLE_TIMEOUT) {
                    pinus.client.isConnected = false;
                    socket.close();
                    return;
                }
                timeout++;

                const rsend = Math.random() * 100 < 50;

                const target = pinus.users[Math.floor(Math.random() * pinus.users.length)];

                if (rsend) {

                    const msg = `{"content": "${random_string(20)}","target":"${target}"}`;
                    // console.log('PINUS Chat Send', msg);
                    const sendData = Protocol.strencode(msg);

                    pinus.request('chat.chatHandler.send', sendData, (byte) => {
                        // 消息回调
                        const str = Protocol.strdecode(byte);

                        const success = check(null, {
                            "PINUS Chat Send 成功": str == '{}'
                        });

                        if (!success) {
                            console.log('PINUS Chat 返回', str);
                        }
                    });
                }

            }, 1000);
        });
    });
}