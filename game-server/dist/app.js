"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_1 = require("pinus");
const routeUtil = require("./app/util/routeUtil");
const preload_1 = require("./preload");
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
        useProtobuf: false
    });
    // app.set('serverConfig', {
    //     reloadHandlers: true,
    // })
});
app.configure('production|development', 'gate', function () {
    app.set('connectorConfig', {
        connector: pinus_1.pinus.connectors.hybridconnector,
        useProtobuf: false
    });
});
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
// app.configure('development', function () {
//     // enable the system monitor modules
//     app.enable('systemMonitor');
// });
// if (app.isMaster()) {
//     app.use(createRobotPlugin({ scriptFile: __dirname + '/robot/robot.js' }));
// }
// start app
app.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQThCO0FBQzlCLGtEQUFtRDtBQUNuRCx1Q0FBb0M7QUFHcEM7Ozs7R0FJRztBQUNILElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBRVY7O0dBRUc7QUFDSCxJQUFJLEdBQUcsR0FBRyxhQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztBQUUxQyxvQkFBb0I7QUFDcEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRSxXQUFXLEVBQUU7SUFDakQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFDckI7UUFDSSxTQUFTLEVBQUUsYUFBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlO1FBQzNDLFNBQVMsRUFBRSxDQUFDO1FBQ1osT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUUsS0FBSztLQUNyQixDQUFDLENBQUM7SUFFUCw0QkFBNEI7SUFDNUIsNEJBQTRCO0lBQzVCLEtBQUs7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxFQUFFO0lBQzVDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQ3JCO1FBQ0ksU0FBUyxFQUFFLGFBQUssQ0FBQyxVQUFVLENBQUMsZUFBZTtRQUMzQyxXQUFXLEVBQUUsS0FBSztLQUNyQixDQUFDLENBQUM7QUFDWCxDQUFDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUU7SUFDcEMsbUJBQW1CO0lBQ25CLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVsQyxvQkFBb0I7SUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUV4QyxnQkFBZ0I7SUFDaEIsMkJBQTJCO0lBQzNCLDJCQUEyQjtJQUMzQixNQUFNO0lBQ04sZ0JBQWdCO0lBQ2hCLDRCQUE0QjtJQUM1QiwwQkFBMEI7SUFDMUIsTUFBTTtBQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUgsNkNBQTZDO0FBQzdDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsTUFBTTtBQUVOLHdCQUF3QjtBQUN4QixpRkFBaUY7QUFDakYsSUFBSTtBQUVKLFlBQVk7QUFDWixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMifQ==