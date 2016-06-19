import {getEmail} from "./auth";

function decorate(self, msg) {
    msg["user"] = {id: self.userId, email: getEmail(self)};
    return msg;
}

export const Logger = {
    info: function(self, msg) {
        console.log('%j', decorate(self, msg));
    },

    error: function(self, msg) {
        console.error('%j', decorate(self, msg));
    }
};