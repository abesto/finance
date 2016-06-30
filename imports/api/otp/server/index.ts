import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as moment from 'moment'
import * as parse from 'csv-parse';

import {
    OtpImportLogCollection, OtpIncomeOrExpense, OtpImportLogEntry, OtpSchemas, OtpCsvLine,
    OtpCsvLineHashCollection
} from "../index.ts";

Meteor.publish('otp.importlogs', () => OtpImportLogCollection.find({}));
Meteor.publish('otp.importLogs.single', (id) => OtpImportLogCollection.find(id));

const parseSync = Meteor.wrapAsync(parse);

function digest(line: OtpCsvLine): string {
    const hash = crypto.createHash('sha256');
    hash.update(line.raw.join(","));
    return hash.digest('hex');
}

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

        // Parse the lines in the CSV
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
                transactionType: array[12] || '',
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

        /// Duplicate detection
        // First, create a map of hash -> import entry of the newly imported items
        const hashes = {};
        _.forEach(entries, entry => hashes[digest(entry.line)] = entry);
        // Next, find any hash entries that already exist, turn them into a map of hash -> importLogId
        const existingHashEntries = OtpCsvLineHashCollection.find({ hash: {$in: _.keys(hashes)} }).fetch();
        const existingHashEntriesMap = {};
        _.forEach(existingHashEntries, function (entry) {
            existingHashEntriesMap[entry.hash] = entry.importLogId
        });
        // Finally update the import log entries accordingly
        _.forEach(hashes, (entry: OtpImportLogEntry, hash: string) => {
            entry.firstImportedIn = existingHashEntriesMap[hash];
        });

        // Insert the imported entries into the import log
        const importLogId = OtpImportLogCollection.insert({
            importedAt: new Date(),
            entries: []
        });
        entries.forEach(entry => { entry.importLogId = importLogId; });
        OtpImportLogCollection.update({_id: importLogId}, {$set: {entries: entries}});

        // Add them to the hash collection, so we know when duplicates are imported later on
        entries.forEach(entry => {
            const hash = digest(entry.line);
            if (OtpCsvLineHashCollection.find({hash: hash}).count() == 0) {
                OtpCsvLineHashCollection.insert({
                    hash: hash,
                    importLogId: importLogId
                })
            }
        });

        return importLogId;
    }
});
