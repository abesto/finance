import {Meteor} from 'meteor/meteor';
import {AccountCollection} from "../../accounts/index";
import {TransactionCollection, TransactionSource, otpImportLineToTransaction} from "../index";
import {OtpImportLogCollection, OtpImportLog, OtpImportLogEntry} from "../../otp/index";
import {Logger} from "../../../startup/server/Logger";

Meteor.methods({
    'transactions.otp.recalculate': function (accountId) {
        TransactionCollection.remove({accountId: accountId, source: TransactionSource.OtpImport});
        OtpImportLogCollection.find().forEach(function (log: OtpImportLog) {
            Meteor.call('transactions.create.otp', log._id);
        });
    },

    'transactions.create.otp': function (otpImportLogId: string) {
        const importLog = OtpImportLogCollection.findOne({_id: otpImportLogId});
        const sharedLogContext = Logger.withContext(this, {type: 'transactions.create.otp', importLogId: otpImportLogId});
        sharedLogContext.info({event: 'start'});
        importLog.entries.forEach((entry: OtpImportLogEntry, index: Number) => {
            const logContext = sharedLogContext.withContext(
                {type: 'transactions.create.otp', importLogId: otpImportLogId, entry: entry, entryIndex: index}
            );
            const account = AccountCollection.findOne({otpAccountNumber: entry.line.account});
            if (account == null) {
                logContext.info({result: 'skip', reason: 'no-matching-account'});
                return;
            }
            if (entry.firstImportedIn != null) {
                logContext.info({result: 'skip', reason: 'otp-entry-is-duplicate'});
                return;
            }
            if (entry.budgetEntry != null && TransactionCollection.findOne(entry.budgetEntry) != null) {
                logContext.info({result: 'skip', reason: 'transaction-exists', transaction: TransactionCollection.findOne(entry.budgetEntry)});
                return;
            }
            const transactionId = TransactionCollection.insert(
                otpImportLineToTransaction(account._id, entry.line)
            );

            const update = {$set: {}};
            update['$set']['entries.' + index + '.budgetEntry'] = transactionId;
            OtpImportLogCollection.update({_id: otpImportLogId}, update);

            logContext.info({result: 'success', transactionId: transactionId, transaction: TransactionCollection.findOne(transactionId)});
        });
        sharedLogContext.info({event: 'done'});
    }
});