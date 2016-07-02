import { Meteor } from 'meteor/meteor';
import {AccountCollection} from "./index";

Meteor.methods({
    'accounts.create': function (name) {
        return AccountCollection.insert({name: name, balance: 0});
    },

    'accounts.delete': function (id) {
        return AccountCollection.remove({_id: id});
    },

    'accounts.rename': function (id, newName) {
        return AccountCollection.update({_id: id}, {$set: {name: newName}});
    }
});
