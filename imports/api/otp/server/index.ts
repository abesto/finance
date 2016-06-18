import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import * as _ from 'lodash';
import * as moment from 'moment'
import * as parse from 'csv-parse';

import {OtpImportLogCollection, OtpIncomeOrExpense, OtpImportLogEntry, OtpSchemas} from "../index.ts";

Meteor.publish('otp.importlogs', () => OtpImportLogCollection.find({}));

const parseSync = Meteor.wrapAsync(parse);

Meteor.methods({
    'otp/import-csv': function (csvText) {
        check(csvText, String);

        var parsed;
        try {
            parsed = parseSync(csvText, {delimiter: ';'});
        } catch (e) {
            throw new Meteor.Error('csv-parsing-failed', e.toString());
        }

        if (parsed.length == 0) {
            throw new Meteor.Error('empty-csv');
        }
        const entries: OtpImportLogEntry[] = _.chain(parsed)
            .map(array => ({
                raw: array,
                account: array[0],
                incomeOrExpense: array[1] == 'T' ? OtpIncomeOrExpense.Expense : OtpIncomeOrExpense.Income,
                amount: Math.abs(parseInt(array[2], 10)),
                currency: array[3],
                dateEntered: moment(array[4], 'YYYYMMDD').toDate(),
                dateCleared: moment(array[5], 'YYYYMMDD').toDate(),
                balanceAfter: parseInt(array[6]),
                partnerAccount: array[7] || '',
                partnerName: array[8] || '',
                memo: array[9] || '',
                memo2: array[10] || '',
                memo3: array[11] || '',
                transactionType: array[12] || ''
            }))
            .map(line => {
                // Early validation to not insert anything if data is invalid
                OtpSchemas["OtpCsvLine"].clean(line);
                OtpSchemas["OtpCsvLine"].validate(line);
                return line;
            })
            .sortBy('dateEntered')
            .map(line => ({
                importLogId: null,
                line: line
            }))
            .value();

        const importLogId = OtpImportLogCollection.insert({
            importedAt: new Date(),
            entries: []
        });
        entries.forEach(entry => { entry.importLogId = importLogId; });
        OtpImportLogCollection.update({_id: importLogId}, {$set: {entries: entries}});

        return importLogId;
    }
});
