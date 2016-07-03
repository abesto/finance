import {Collection2} from "meteor/collections2";
import "./methods";

export const AccountSchemas: {[key: string]: SimpleSchema} = {};

export interface Account {
    _id?: string
    name: string
    balance: Number

    // OTP account number -> WNAB Account translation could be part of a generic framework of automatic transaction
    // transformations. But, there's no need for it right now, and this is much simpler to reason about.
    otpAccountNumber?: string
}
AccountSchemas["Account"] = new SimpleSchema({
    name: {type: String},
    balance: {type: Number},
    otpAccountNumber: {type: String, optional: true}
});

export const AccountCollection = new Mongo.Collection('accounts') as Collection2<Account>;
AccountCollection.attachSchema(AccountSchemas["Account"]);

