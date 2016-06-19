import { Meteor } from 'meteor/meteor';
import {Logger} from "./Logger";
import {MeteorMethodsUnsafe} from "./InsecureMethods";

const allowedEmails = Meteor.isServer ? (process.env["ALLOWED_EMAILS"] || 'abesto0@gmail.com').split(' ') : [];

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
        Logger.error(self, {type: 'auth-denied', reason: 'no userId'});
        return false;
    }
    const user = Meteor.users.findOne(userId);
    if (!user) {
        Logger.error(self, {type: 'auth-denied', reason: 'no user with this id'});
        return false;
    }
    const email = user.services.google.email;
    if (allowedEmails.indexOf(email) == -1) {
        Logger.error(self, {type: 'auth-denied', reason: 'not in allowed email list', email: email, allowedEmailList: allowedEmails});
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
