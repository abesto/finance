import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Collection2 } from 'meteor/collections2';
import * as _ from 'lodash';

import {OtpCsvLine, OtpIncomeOrExpense} from "../otp/index";

export const TransactionSchemas: {[key: string]: SimpleSchema} = {};

export enum TransactionSource {
    Manual, OtpImport
}

interface Transaction {
    _id?: string
    accountId: string
    memo: string
    amount: Number,
    source: TransactionSource,
    date: Date,
    payee: string
    categoryId?: string
}
TransactionSchemas["Transaction"] = new SimpleSchema({
    accountId: {type: String},
    memo: {type: String},
    amount: {type: Number},
    source: {
        type: typeof TransactionSource.Manual,
        allowedValues: [TransactionSource.Manual, TransactionSource.OtpImport]
    },
    date: {type: Date},
    payee: {type: String, optional: true},
    categoryId: {type: String, optional: true}
});

export const TransactionCollection = new Mongo.Collection<Transaction>('transactions') as Collection2<Transaction>;
TransactionCollection.attachSchema(TransactionSchemas["Transaction"]);

export const otpImportLineToTransaction = (accountId: string, line: OtpCsvLine) => {
    var amount = line.amount;
    if (
        (line.incomeOrExpense == OtpIncomeOrExpense.Expense && amount > 0)
        || line.incomeOrExpense == OtpIncomeOrExpense.Income && amount < 0)
    {
        amount *= -1;
    }
    return {
        accountId: accountId,
        amount: amount,
        memo: [line.transactionType, line.memo, line.memo2, line.memo3].filter(_.identity).join(' '),
        date: line.dateEntered,
        payee: line.partnerName,
        source: TransactionSource.OtpImport
    };
};

//Meteor.startup(function () {
//    TransactionCollection.rawCollection().createIndex({accountId: 1});
//});
