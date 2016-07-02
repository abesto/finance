import * as React from 'react'
import {ListItem, IconButton} from 'material-ui'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

import {Account} from "../../../api/accounts/index"
import * as formatters from "../../formatters"
import {history} from "../../../startup/client/history"

function openAccount(accountId: string) {
    return function () {
        history.push(`/account/${accountId}/settings`);
    }
}

interface P {
    loading: boolean
    accounts: Account[]
}

export const SidebarAccountsList = function SidebarAccountsList({loading, accounts}: P) {
    if (loading) {
        return <p>Loading accounts...</p>;
    } else {
        return <div className="accounts-list">{
            accounts.map(account => <ListItem
                className="accounts-list-item"
                key={account._id}
                primaryText={account.name}
                secondaryText={formatters.money(account.balance)}
                value={"/account/" + account._id}
                rightIconButton={
                    <IconButton className="accounts-list-edit-button" tooltip="Settings" onClick={openAccount(account._id)}>
                        <SettingsIcon/>
                    </IconButton>
                }
            />)
        }</div>;
    }
};