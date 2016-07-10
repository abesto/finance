import * as moment from 'moment'
import * as _ from 'lodash'

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Collection2 } from 'meteor/collections2';

export var OtpSchemas: {[key: string]: SimpleSchema} = {};

export enum OtpIncomeOrExpense {
    Income, Expense
}

export interface OtpCsvLine {
    raw: string[]
    account: string
    incomeOrExpense: OtpIncomeOrExpense,
    amount: Number
    currency: string,
    dateEntered: Date,
    dateCleared: Date,
    balanceAfter: Number,
    partnerAccount: string,
    partnerName: string,
    memo: string,
    memo2: string,
    memo3: string,
    transactionType: string
}
OtpSchemas["OtpCsvLine"] = new SimpleSchema({
    raw: { type: [String] },
    account: { type: String },
    incomeOrExpense: {
        type: typeof OtpIncomeOrExpense.Income,
        allowedValues: [OtpIncomeOrExpense.Income, OtpIncomeOrExpense.Expense]
    },
    amount: { type: Number },
    currency: { type: String },
    dateEntered: { type: Date },
    dateCleared: { type: Date },
    balanceAfter: { type: Number },
    partnerAccount: { type: String, optional: true },
    partnerName: { type: String, optional: true },
    memo: { type: String, optional: true },
    memo2: { type: String, optional: true },
    memo3: { type: String, optional: true },
    transactionType: { type: String },
});

export interface OtpImportLogEntry {
    line: OtpCsvLine
    importLogId: string
    budgetEntry?: string  // Transaction._id
    firstImportedIn?: string  // importLogId
}
OtpSchemas["OtpImportLogEntry"] = new SimpleSchema({
    line: { type: OtpSchemas["OtpCsvLine"] },
    importLogId: { type: String },
    budgetEntry: { type: String, optional: true },
    firstImportedIn: { type: String, optional: true }
});

export interface OtpImportLog {
    _id?: string
    importedAt: Date
    entries: OtpImportLogEntry[]
}
OtpSchemas["OtpImportLog"] = new SimpleSchema({
    importedAt: { type: Date },
    entries: { type: [OtpSchemas["OtpImportLogEntry"]] }
});

export const msgNEntriesImportedAt = function (l: OtpImportLog) {
    const itemCount = l.entries ? l.entries.length : 0;
    return itemCount + ' entries imported at ' + moment(l.importedAt).format('YYYY-MM-DD HH:mm');
};

export const msgImportInterval = function (l: OtpImportLog) {
    const from = moment(_.first(l.entries).line.dateEntered).format('YYYY-MM-DD');
    const until = moment(_.last(l.entries).line.dateEntered).format('YYYY-MM-DD');
    if (from == until) {
        return from;
    } else {
        return from + " to " + until;
    }
};

export const OtpImportLogCollection = new Mongo.Collection('otp.importlog') as Collection2<OtpImportLog>;
OtpImportLogCollection.attachSchema(OtpSchemas["OtpImportLog"]);

export interface OtpCsvLineHash {
    hash: string
    importLogId: string
}
OtpSchemas["OtpCsvLineHash"] = new SimpleSchema({
    hash: {type: String},
    importLogId: {type: String}
});
export const OtpCsvLineHashCollection = new Mongo.Collection('otp.csvlinehash') as Collection2<OtpCsvLineHash>;
OtpCsvLineHashCollection.attachSchema(OtpSchemas["OtpCsvLineHash"]);

//Meteor.startup(function () {
//    OtpCsvLineHashCollection.rawCollection().createIndex({hash: 1}, {unique: true});
//});

