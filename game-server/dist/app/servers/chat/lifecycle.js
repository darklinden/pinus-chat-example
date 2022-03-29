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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY2hhdC9saWZlY3ljbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUNJLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRkQsNEJBRUM7QUFHRCxNQUFNLFNBQVM7SUFDWCxhQUFhLENBQUMsR0FBZ0IsRUFBRSxFQUFjO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDcEQsRUFBRSxFQUFFLENBQUM7SUFDVCxDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQWdCLEVBQUUsRUFBYztRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsRUFBRSxDQUFDO0lBQ1QsQ0FBQztJQUVELGFBQWEsQ0FBQyxHQUFnQjtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxjQUFjLENBQUMsR0FBZ0IsRUFBRSxRQUFvQixFQUFFLG1CQUErQjtRQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELFFBQVEsRUFBRSxDQUFDO0lBQ2YsQ0FBQztDQUNKIn0=