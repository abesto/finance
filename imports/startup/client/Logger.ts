import * as _ from 'lodash'

function coalesce(msgs: {}[]) {
    return _.reduce(msgs, _.extend, {});
}

function decorate(msg) {
    msg["client-time"] = new Date();
    return msg;
}

interface ILogger {
    info: (...msgs: {}[]) => void
    error: (...msgs: {}[]) => void
}

export const Logger = {
    info(...msgs: {}[]) {
        const msg = coalesce(msgs);
        console.log(msg);
        Meteor.call('log.info', decorate(msg));
    },

    error(...msgs: {}[]) {
        const msg = coalesce(msgs);
        console.error(msg);
        Meteor.call('log.error', decorate(msg));
    },
    
    withContext(...ctxs: {}[]): ILogger {
        const ctx = coalesce(ctxs);
        return _.mapValues(Logger, function (f) {
            return _.partial(f, ctx);
        });
    }
};
