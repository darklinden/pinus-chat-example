"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Robot = void 0;
const pinus_robot_plugin_1 = require("pinus-robot-plugin");
class Robot {
    constructor(actor) {
        this.actor = actor;
        this.openid = String(Math.round(Math.random() * 1000));
        this.pinusClient = new pinus_robot_plugin_1.PinusWSClient();
    }
    connectGate() {
        let host = '127.0.0.1';
        let port = '3014';
        this.pinusClient.on(pinus_robot_plugin_1.PinusWSClientEvent.EVENT_IO_ERROR, (event) => {
            // 错误处理
            console.error('error', event);
        });
        this.pinusClient.on(pinus_robot_plugin_1.PinusWSClientEvent.EVENT_CLOSE, function (event) {
            // 关闭处理
            console.error('close', event);
        });
        this.pinusClient.on(pinus_robot_plugin_1.PinusWSClientEvent.EVENT_HEART_BEAT_TIMEOUT, function (event) {
            // 心跳timeout
            console.error('heart beat timeout', event);
        });
        this.pinusClient.on(pinus_robot_plugin_1.PinusWSClientEvent.EVENT_KICK, function (event) {
            // 踢出
            console.error('kick', event);
        });
        // this.actor.emit("incr" , "gateConnReq");
        this.actor.emit('start', 'gateConn', this.actor.id);
        this.pinusClient.init({
            host: host,
            port: port
        }, () => {
            this.actor.emit('end', 'gateConn', this.actor.id);
            // 连接成功执行函数
            console.log('gate连接成功');
            this.gateQuery();
        });
    }
    gateQuery() {
        // this.actor.emit("incr" , "gateQueryReq");
        this.actor.emit('start', 'gateQuery', this.actor.id);
        this.pinusClient.request('gate.gateHandler.queryEntry', { uid: this.openid }, (result) => {
            // 消息回调
            // console.log("gate返回",JSON.stringify(result));
            this.actor.emit('end', 'gateQuery', this.actor.id);
            this.pinusClient.disconnect();
            this.connectToConnector(result);
        });
    }
    connectToConnector(result) {
        // this.actor.emit("incr" , "loginConnReq");
        this.actor.emit('start', 'loginConn', this.actor.id);
        this.pinusClient.init({
            host: result.host,
            port: result.port
        }, () => {
            this.actor.emit('end', 'loginConn', this.actor.id);
            // 连接成功执行函数
            console.log('connector连接成功');
            this.loginQuery({ rid: this.actor.id.toString(), username: this.actor.id.toString() });
        });
    }
    loginQuery(result) {
        // this.actor.emit("incr" , "loginQueryReq");
        this.actor.emit('start', 'loginQuery', this.actor.id);
        this.pinusClient.request('connector.entryHandler.enter', result, (ret) => {
            // 消息回调
            this.actor.emit('end', 'loginQuery', this.actor.id);
            console.log('connector返回', JSON.stringify(result));
            setTimeout(() => this.loginQuery(result), Math.random() * 5000 + 1000);
        });
    }
}
exports.Robot = Robot;
function default_1(actor) {
    let client = new Robot(actor);
    client.connectGate();
    return client;
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9ib3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb2JvdC9yb2JvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyREFBc0U7QUFHdEUsTUFBYSxLQUFLO0lBQ2QsWUFBb0IsS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUFJaEMsV0FBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWxELGdCQUFXLEdBQUcsSUFBSSxrQ0FBYSxFQUFFLENBQUM7SUFKbEMsQ0FBQztJQU1NLFdBQVc7UUFFZCxJQUFJLElBQUksR0FBRyxXQUFXLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLHVDQUFrQixDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzdELE9BQU87WUFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLHVDQUFrQixDQUFDLFdBQVcsRUFBRSxVQUFTLEtBQUs7WUFDOUQsT0FBTztZQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsdUNBQWtCLENBQUMsd0JBQXdCLEVBQUUsVUFBUyxLQUFLO1lBQzNFLFlBQVk7WUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsdUNBQWtCLENBQUMsVUFB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