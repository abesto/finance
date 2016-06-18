export const Logger = {
    info: function(msg) {
        console.log('%j', msg);
    },

    error: function(msg) {
        console.error('%j', msg);
    }
};