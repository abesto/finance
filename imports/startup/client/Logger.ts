function decorate(msg) {
    msg["client-time"] = new Date();
    return msg;
}

export const Logger = {
    info(msg) {
        console.log(msg);
        Meteor.call('log.info', decorate(msg));
    },

    error(msg) {
        console.error(msg);
        Meteor.call('log.error', decorate(msg));
    }
};
