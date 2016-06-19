import { Meteor } from 'meteor/meteor';
import {throwUnlessAuthed, getEmail} from "./auth";
import {Logger} from "./Logger";

const originalPublish = Meteor.publish;

Meteor.publish = function publish(name, f) {
    originalPublish(name, function() {
        var action = {type: 'subscribe', arguments: Array.prototype.slice.call(arguments), subscriptionName: name};
        throwUnlessAuthed(this, action);
        Logger.info(this, action);
        return f.apply(this, arguments);
    });
};