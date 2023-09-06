import { ChatRemote } from '../remote/chatRemote';
import { Application, BackendSession } from 'pinus';
import { FrontendSession } from 'pinus';

import { getLogger } from 'pinus-logger';
import * as path from 'path';
let logger = getLogger('pinus', path.basename(__filename));

export default function (app: Application) {
    return new ChatHandler(app);
}

export class ChatHandler {
    constructor(private app: Application) {
    }

    /**
     * Send messages to users
     *
     * @param {Object} msg message from client
     * @param {Object} session
     *
     */
    async send(msg: { content: string, target: string }, session: BackendSession) {

        logger.debug('chatHandler.send', msg)

        let rid = session.get('rid');
        let username = session.uid.split('*')[0];
        let channelService = this.app.get('channelService');
        let param = {
            msg: msg.content,
            from: username,
            target: msg.target
        };
        let channel = channelService.getChannel(rid, false);

        // the target is all users
        if (msg.target === '*') {
            channel.pushMessage('onChat', param);
        }
        // the target is specific user
        else {
            let tuid = msg.target + '*' + rid;
            let tsid = channel.getMember(tuid)['sid'];
            channelService.pushMessageByUids('onChat', param, [{
                uid: tuid,
                sid: tsid
            }]);
        }
    }
}