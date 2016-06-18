import { Meteor } from 'meteor/meteor';
import {throwUnlessAuthed, getEmail} from "./auth";
import {Logger} from "./Logger";

const originalPublish = Meteor.publish;

Meteor.publish = function publish(name, f) {
    originalPublish(name, function() {
        var action = {type: 'subscribe', arguments: Array.prototype.slice.call(arguments), subscriptionName: name, user: {_id: this.userId, email: getEmail(this)}};
        throwUnlessAuthed(this, action);
        Logger.info(action);
        return f.apply(this, arguments);
    });
};