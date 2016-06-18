import { Meteor } from 'meteor/meteor';

const allowedEmails = Meteor.isServer ? (process.env.ALLOWED_EMAILS || '').split(' ') : [];

export function isAuthed(self) {
    if (Meteor.isClient) {
        return !!Meteor.userId();
    }
    if (Meteor.isServer) {
        const userId = self.userId;
        if (!userId) {
            return false;
        }
        const user = Meteor.users.findOne(userId);
        if (!user) {
            return false;
        }
        if (Meteor.isProduction && allowedEmails.indexOf(user.services.google.email) == -1) {
            return false;
        }
        return true;
    }
}

export function throwUnlessAuthed(self) {
    if (!isAuthed(self)) {
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