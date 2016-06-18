import {Meteor} from 'meteor/meteor';
Meteor.methodsUnsafe = Meteor.methods;

import './SecurePublish.ts'
import './SecureCollection.ts'
import './SecureMethods.ts'

import '/imports/api/otp/server/index.ts'
import '/imports/api/categories/server/index.ts'
