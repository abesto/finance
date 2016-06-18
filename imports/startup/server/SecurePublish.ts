import { Meteor } from 'meteor/meteor';
import {throwUnlessAuthed, getEmail} from "./auth";

const originalPublish = Meteor.publish;

Meteor.publish = function publish(name, f) {
    originalPublish(name, function() {
        var action = {type: 'subscribe', arguments: Array.prototype.slice.call(arguments), subscriptionName: name, user: {_id: this.userId, email: getEmail(this)}};
        throwUnlessAuthed(this, action);
        console.log(action);
        return f.apply(this, arguments);
    });
};