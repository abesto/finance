import {Meteor} from 'meteor/meteor';
import {TransactionCollection} from "../index";
import "./methods.ts";

Meteor.publish('transactions', function () {
    Counts.publish(this, 'all-transactions', TransactionCollection.find());
    return TransactionCollection.find({}, {sort: {date: -1}});
});