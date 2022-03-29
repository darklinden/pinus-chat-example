"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_1 = require("pinus");
const routeUtil = require("./app/util/routeUtil");
const preload_1 = require("./preload");
const pinus_robot_plugin_1 = require("pinus-robot-plugin");
/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
(0, preload_1.preload)();
/**
 * Init app for client.
 */
let app = pinus_1.pinus.createApp();
app.set('name', 'chatofpomelo-websocket');
// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig', {
        connector: pinus_1.pinus.connectors.hybridconnector,
        heartbeat: 3,
        useDict: true,
        useProtobuf: true
    });
    app.set('serverConfig', {
        reloadHandlers: true,
    });
});
app.configure('production|development', 'gate', function () {
    app.set('connectorConfig', {
        connector: pinus_1.pinus.connectors.hybridconnector,
        useProtobuf: true
    });
});
// app configure
app.configure('production|development', function () {
    // route configures
    app.route('chat', routeUtil.chat);
    // filter configures
    app.filter(new pinus_1.pinus.filters.timeout());
    // 热更新 handler配置
    // app.set('serverConfig',{
    //     reloadHandlers:true,
    // });
    // 热更新 remote 配置
    // app.set('remoteConfig', {
    //     reloadRemotes: true
    // });
});
app.configure('development', function () {
    // enable the system monitor modules
    app.enable('systemMonitor');
});
if (app.isMaster()) {
    app.use((0, pinus_robot_plugin_1.createRobotPlugin)({ scriptFile: __dirname + '/robot/robot.js' }));
}
// start app
app.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQThCO0FBQzlCLGtEQUFtRDtBQUNuRCx1Q0FBb0M7QUFDcEMsMkRBQXVEO0FBRXZEOzs7O0dBSUc7QUFDSCxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUVWOztHQUVHO0FBQ0gsSUFBSSxHQUFHLEdBQUcsYUFBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzVCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUM7QUFFMUMsb0JBQW9CO0FBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUUsV0FBVyxFQUFFO0lBQ2pELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQ3JCO1FBQ0ksU0FBUyxFQUFFLGFBQUssQ0FBQyxVQUFVLENBQUMsZUFBZTtRQUMzQyxTQUFTLEVBQUUsQ0FBQztRQUNaLE9BQU8sRUFBRSxJQUFJO1FBQ2IsV0FBVyxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRVAsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7UUFDcEIsY0FBYyxFQUFFLElBQUk7S0FDdkIsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsU0FBUyxDQUFDLHdCQUF3QixFQUFFLE1BQU0sRUFBRTtJQUM1QyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUNyQjtRQUNJLFNBQVMsRUFBRSxhQUFLLENBQUMsVUFBVSxDQUFDLGVBQWU7UUFDM0MsV0FBVyxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0FBQ1gsQ0FBQyxDQUFDLENBQUM7QUFFSCxnQkFBZ0I7QUFDaEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRTtJQUNwQyxtQkFBbUI7SUFDbkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxDLG9CQUFvQjtJQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksYUFBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLGdCQUFnQjtJQUNoQiwyQkFBMkI7SUFDM0IsMkJBQTJCO0lBQzNCLE1BQU07SUFDTixnQkFBZ0I7SUFDaEIsNEJBQTRCO0lBQzVCLDBCQUEwQjtJQUMxQixNQUFNO0FBQ1YsQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtJQUN6QixvQ0FBb0M7SUFDcEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFO0lBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxzQ0FBaUIsRUFBQyxFQUFFLFVBQVUsRUFBRSxTQUFTLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDN0U7QUFFRCxZQUFZO0FBQ1osR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIn0=