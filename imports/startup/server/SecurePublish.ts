import { Meteor } from 'meteor/meteor';
import {throwUnlessAuthed} from "../../auth";

const originalPublish = Meteor.publish;

Meteor.publish = function publish(name, f) {
    originalPublish(name, function() {
        throwUnlessAuthed(this);
        return f.apply(this, arguments);
    });
};