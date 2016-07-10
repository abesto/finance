import {Meteor} from 'meteor/meteor';
import {AccountCollection} from "../index";

Meteor.methods({
    'accounts.set-otp-account-number': function (accountId: string, otpAccountNumber:string) {
        AccountCollection.update({_id: accountId}, {$set: {otpAccountNumber: otpAccountNumber}});
        Meteor.call('transactions.otp.recalculate', accountId);
    }
});
