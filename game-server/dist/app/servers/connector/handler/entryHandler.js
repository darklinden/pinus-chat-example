"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryHandler = void 0;
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = (0, pinus_logger_1.getLogger)('pinus', path.basename(__filename));
function default_1(app) {
    return new EntryHandler(app);
}
exports.default = default_1;
class EntryHandler {
    constructor(app) {
        this.app = app;
    }
    /**
     * New client entry chat server.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async enter(msg, session) {
        let self = this;
        logger.log('New client entry chat server: %j', msg);
        let rid = msg.rid;
        let uid = msg.username + '*' + rid;
        let sessionService = self.app.get('sessionService');
        // duplicate log in
        if (!!sessionService.getByUid(uid)) {
            return {
                code: 500,
                error: true
            };
        }
        await session.abind(uid);
        session.set('rid', rid);
        session.push('rid', function (err) {
            if (err) {
                console.error('set rid for session service failed! error is : %j', err.stack);
            }
        });
        session.on('closed', this.onUserLeave.bind(this));
        logger.debug('[%s] enter room: %s', uid, rid);
        // put user into channel
        let users = await self.app.rpc.chat.chatRemote.add.route(session)(uid, self.app.get('serverId'), rid, true);
        return {
            users: users
        };
    }
    /**
     * User log out handler
     *
     * @param {Object} app current application
     * @param {Object} session current session object
     *
     */
    onUserLeave(session) {
        if (!session || !session.uid) {
            return;
        }
        logger.log('User leave: %j', session.uid);
        this.app.rpc.chat.chatRemote.kick.route(session, true)(session.uid, this.app.get('serverId'), session.get('rid'));
    }
}
exports.EntryHandler = EntryHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2hhbmRsZXIvZW50cnlIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLCtDQUF5QztBQUN6Qyw2QkFBNkI7QUFDN0IsSUFBSSxNQUFNLEdBQUcsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFM0QsbUJBQXlCLEdBQWdCO0lBQ3JDLE9BQU8sSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUZELDRCQUVDO0FBRUQsTUFBYSxZQUFZO0lBQ3JCLFlBQW9CLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7SUFDcEMsQ0FBQztJQUdEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFzQyxFQUFFLE9BQXdCO1FBQ3hFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUVoQixNQUFNLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBRW5ELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDbEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ25DLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFcEQsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDaEMsT0FBTztnQkFDSCxJQUFJLEVBQUUsR0FBRztnQkFDVCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUM7U0FDTDtRQUVELE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLEdBQUc7WUFDN0IsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxtREFBbUQsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDakY7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFOUMsd0JBQXdCO1FBQ3hCLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUcsT0FBTztZQUNILEtBQUssRUFBRSxLQUFLO1NBQ2YsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxXQUFXLENBQUMsT0FBd0I7UUFDaEMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDMUIsT0FBTztTQUNWO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN0SCxDQUFDO0NBQ0o7QUE3REQsb0NBNkRDIn0=