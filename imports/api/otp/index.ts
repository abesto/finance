import { Mongo } from 'meteor/mongo';
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
    transactionType: { type: String }
});

export interface OtpImportLogEntry {
    line: OtpCsvLine
    importLogId: string
    budgetEntry?: any  // Will point to the budget entry this entry was turned into, if any (none if this is a duplicate)
}
OtpSchemas["OtpImportLogEntry"] = new SimpleSchema({
    line: { type: OtpSchemas["OtpCsvLine"] },
    importLogId: { type: String },
    budgetEntry: { type: Object, blackbox: true, optional: true }
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

export const OtpImportLogCollection = new Mongo.Collection('otp.importlog') as Collection2<OtpImportLog>;
OtpImportLogCollection.attachSchema(OtpSchemas["OtpImportLog"]);

export const OtpCsvLineCollection = new Mongo.Collection<OtpCsvLine>('otp.csvlines');
