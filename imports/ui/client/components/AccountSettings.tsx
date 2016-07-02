import * as React from 'react';
import {RaisedButton} from 'material-ui';

import {RIEMaterialInput} from "./RIEMaterialInput";

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
    return function (props) {
        Logger.info({type: 'rename-account', id: account._id, oldName: account.name, newName: props.newName});
        Meteor.call('accounts.rename', account._id, props.newName);
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
        <div style={{fontSize: 25}}>
            <RIEMaterialInput className="editable-account-name" value={account.name} propName="newName"
                              change={renameAccount(account)} inputName="account-name"/>
        </div>
        <RaisedButton className="delete-account-button" label="Delete" secondary={true} onClick={deleteAccount(account)}/>
    </div>;
};
