import * as React from 'react';
import {RaisedButton, Paper} from 'material-ui';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

import {OurTextField} from "./OurTextField";
import {Account} from "../../../api/accounts/index";
import {Logger} from "../../../startup/client/Logger";
import {history} from "../../../startup/client/history";

// TODO: change to /account once that page is implemented
const redirectToPathAfterDeletion = '/budget';

function deleteAccount(account: Account) {
    const deleteLogger = Logger.withContext({type: "ui", flow: "delete-account", id: account._id, name: account.name});
    return function () {
        deleteLogger.info({event: "started-by-delete-button"});
        if (confirm(`Are you sure you want to delete the account "${account.name}" (id: ${account._id})?\n\nThis will permanently delete all associated transaction data.`)) {
            Logger.info({event: 'confirmed'});
            Meteor.call('accounts.delete', account._id, function (err) {
                if (err) {
                    deleteLogger.error({event: "call-failed", reason: err.toString()});
                    alert("Deletion failed: " + err.toString());
                } else {
                    deleteLogger.info({event: "done"});
                    Logger.info({type: 'redirect', to: redirectToPathAfterDeletion, reason: 'active-account-deleted'});
                    history.push(redirectToPathAfterDeletion);
                }
            })
        } else {
            deleteLogger.info({event: 'cancelled'});
        }
    }
}

function renameAccount(account: Account) {
    return function (evt) {
        const newName = evt.target.value;
        Logger.info({type: 'rename-account', id: account._id, oldName: account.name, newName: newName});
        Meteor.call('accounts.rename', account._id, newName);
    }
}

function setOtpAccountNumber(account: Account) {
    return function (evt) {
        const newNumber = evt.target.value;
        Logger.info({type: 'set-otp-account-number', id: account._id, name: account.name,
            oldOtpAccountNumber: account.otpAccountNumber, newOtpAccountNumber: newNumber});
        Meteor.call('accounts.set-otp-account-number', account._id, newNumber);
    }
}

interface P {
    loading: boolean
    account: Account
}

export const AccountSettings = ({loading, account}: P) => {
    if (loading) {
        return <p>Loading account details...</p>
    }
    return <div className="account-settings">
        <OurTextField className="editable-account-name" defaultValue={account.name} onBlur={renameAccount(account)} inputName="account-name" floatingLabelText="Name"/><br/>
        <OurTextField floatingLabelText="OTP Account number" defaultValue={account.otpAccountNumber} onBlur={setOtpAccountNumber(account)}/><br />
        <Paper style={{padding: 20, paddingTop: 10, marginTop: 15}}>
            <h2>
                <WarningIcon style={{verticalAlign: 'middle'}} color="#cc0000" />
                <span style={{color: '#cc0000', marginLeft: 5}}>Danger zone</span>
            </h2>
            <RaisedButton className="delete-account-button" label="Delete Account" secondary={true} onClick={deleteAccount(account)}/>
        </Paper>
    </div>;
};
