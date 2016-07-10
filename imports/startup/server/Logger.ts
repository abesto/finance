import {getEmail} from "./auth";
import {MeteorMethodsUnsafe} from "./InsecureMethods";
import * as _ from 'lodash';

interface LoggerContext {
    userId: string,
    connection: Meteor.Connection
}

function coalesce(msgs: {}[]) {
    return _.reduce(msgs, _.extend, {});
}

function decorate(ctx: LoggerContext, msg) {
    msg["user"] = {id: ctx.userId, email: getEmail(ctx)};
    msg["connection"] = {id: ctx.connection.id, clientAddress: ctx.connection.clientAddress};
    if (!msg.hasOwnProperty("source")) {
        msg["source"] = "server";
    }
    return msg;
}

interface ILogger {
    info: (...msgs: {}[]) => void
    error: (...msgs: {}[]) => void
    withContext: (...ctxs: {}[]) => ILogger
}

export const Logger = {
    info: function(ctx: LoggerContext, ...msgs) {
        console.log('%j', decorate(ctx, coalesce(msgs)));
    },

    error: function(ctx: LoggerContext, ...msgs) {
        console.error('%j', decorate(ctx, coalesce(msgs)));
    },

    withContext: function(...ctxs: {}[]): ILogger {
        return _.mapValues(Logger, function (f) {
            return _.partial(f, ...ctxs);
        });
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

