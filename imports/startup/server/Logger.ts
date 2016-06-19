import {getEmail} from "./auth";
import {MeteorMethodsUnsafe} from "./InsecureMethods";
import * as _ from 'lodash';

interface LoggerContext {
    userId: string
}

function decorate(ctx: LoggerContext, msg) {
    msg["user"] = {id: ctx.userId, email: getEmail(ctx)};
    if (!msg.hasOwnProperty("source")) {
        msg["source"] = "server";
    }
    return msg;
}

export const Logger = {
    info: function(ctx: LoggerContext, msg) {
        console.log('%j', decorate(ctx, msg));
    },

    error: function(ctx: LoggerContext, msg) {
        console.error('%j', decorate(ctx, msg));
    }
};

MeteorMethodsUnsafe({
    'log.info': function (msg) {
        this.unblock();
        Logger.info(this, _.extend(msg, {source: 'client'}));
    },

    'log.error': function (msg) {
        this.unblock();
        Logger.error(this, _.extend(msg, {source: 'client'}));
    }
});

