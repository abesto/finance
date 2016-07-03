import { Meteor } from 'meteor/meteor';
import {AccountCollection} from "../index";
import './methods.ts';

Meteor.publish('accounts', function () { return AccountCollection.find(); });
Meteor.publish('accounts.single', function (id) { return AccountCollection.find(id); });
