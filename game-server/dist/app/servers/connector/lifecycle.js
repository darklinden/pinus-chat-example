"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return new Lifecycle();
}
exports.default = default_1;
class Lifecycle {
    beforeStartup(app, cb) {
        console.log(app.getServerId(), '!!!before startup');
        cb();
    }
    afterStartup(app, cb) {
        console.log(app.getServerId(), '!!afterStartup');
        cb();
    }
    afterStartAll(app) {
        console.log(app.getServerId(), '!!after start all');
    }
    beforeShutdown(app, shutDown, cancelShutDownTimer) {
        console.log(app.getServerId(), '!!beforeShutdown');
        shutDown();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2xpZmVjeWNsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQ0ksT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFGRCw0QkFFQztBQUdELE1BQU0sU0FBUztJQUNYLGFBQWEsQ0FBQyxHQUFnQixFQUFFLEVBQWM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUNwRCxFQUFFLEVBQUUsQ0FBQztJQUNULENBQUM7SUFFRCxZQUFZLENBQUMsR0FBZ0IsRUFBRSxFQUFjO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDakQsRUFBRSxFQUFFLENBQUM7SUFDVCxDQUFDO0lBRUQsYUFBYSxDQUFDLEdBQWdCO1FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELGNBQWMsQ0FBQyxHQUFnQixFQUFFLFFBQW9CLEVBQUUsbUJBQStCO1FBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsUUFBUSxFQUFFLENBQUM7SUFDZixDQUFDO0NBQ0oifQ==