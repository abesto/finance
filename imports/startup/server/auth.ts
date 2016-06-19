import { Meteor } from 'meteor/meteor';
import {Logger} from "./Logger";
import {MeteorMethodsUnsafe} from "./InsecureMethods";

const allowedEmails = Meteor.isServer ? (process.env["ALLOWED_EMAILS"] || 'abesto0@gmail.com').split(' ') : [];
Accounts.validateNewUser((user) => allowedEmails.indexOf(user.services.google.email) > -1);

export function getEmail(self) {
    try {
        return Meteor.users.findOne(self.userId).services.google.email;
    } catch (e) {
        return null;
    }
}

export function isAuthed(self) {
    const userId = self.userId;
    if (!userId) {
        Logger.info(self, {type: 'not-authed', reason: 'no userId'});
        return false;
    }
    const user = Meteor.users.findOne(userId);
    if (!user) {
        Logger.error(self, {type: 'not-authed', reason: 'no user with this id'});
        return false;
    }
    const email = user.services.google.email;
    if (allowedEmails.indexOf(email) == -1) {
        Logger.error(self, {type: 'not-authorized', reason: 'not in allowed email list', email: email, allowedEmailList: allowedEmails});
        return false;
    }
    return true;
}

export function throwUnlessAuthed(self, logData) {
    if (!isAuthed(self)) {
        Logger.error(self, {type: 'not-authorized', requested: logData});
        throw new Meteor.Error("not-authorized");
    }
}

const denyAll = {
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
};
export function denyAllCollectionMethods(collection) {
    collection.deny(denyAll);
}

Meteor.startup(function () {
    MeteorMethodsUnsafe({
        isAuthed: function() {
            return isAuthed(this);
        },

        getMyEmail: function() {
            return getEmail(this);
        }
    });
});
