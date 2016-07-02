import * as React from 'react';
import {withRouter, IRouter} from 'react-router';
import {Drawer, ListItem, Divider, Subheader, MakeSelectable, List, FlatButton} from 'material-ui';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import BalanceIcon from 'material-ui/svg-icons/action/account-balance';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';

import {WnabAppBar} from './WnabAppBar';
import {SidebarAccountsListContainer} from '../containers/SidebarAccountsListContainer';
import {TextInputDialog} from "./TextInputDialog";
import {Logger} from "../../../startup/client/Logger";

const SelectableList = MakeSelectable(List);

interface PPure {
    onChange: (e, value: any) => void
}

interface PWithRouter extends PPure {
    router: IRouter
}

class PureSidebar extends React.Component<PPure, {}> {
    dialog: TextInputDialog;

    handleCreateAccountButtonClick = () => {
        Logger.info({type: 'ui', flow: 'create-account', event: 'clicked-start'});
        this.dialog.open();
    };

    createAccount(name) {
        Logger.info({type: 'ui', flow: 'create-account', event: 'clicked-create', name: name});
        Meteor.call('accounts.create', name, (err, res) => {
            if (err) {
                Logger.info({type: 'ui', flow: 'create-account', event: 'call-failed', name: name, error: err});
            } else {
                Logger.info({type: 'ui', flow: 'create-account', event: 'done', name: name, createdId: res});
            }
        });
    }

    render() {
        const onChange = this.props.onChange;
        return (
            <Drawer className="sidebar" docked={true}>
                <WnabAppBar/>
                <SelectableList onChange={onChange} value={location.pathname}>
                    <ListItem id="nav-budget" leftIcon={<EmailIcon/>} primaryText="Budget" value="/"/>
                    <ListItem id="nav-all-accounts" leftIcon={<BalanceIcon/>} primaryText="All Accounts" value="/account"/>
                    <ListItem id="nav-otp" leftIcon={<CloudUploadIcon/>} value="/otp" primaryText="OTP Import"/>
                    <Divider/>
                    <Subheader>Accounts</Subheader>
                    <SidebarAccountsListContainer/>
                    <FlatButton className="create-account-button" label="Add Account" icon={<AddIcon/>} onClick={this.handleCreateAccountButtonClick}/>
                </SelectableList>

                <TextInputDialog
                    ref={(dlg) => this.dialog = dlg}
                    title="New Account"
                    description="Account name:"
                    okButtonLabel="Create"
                    onOk={this.createAccount}
                    className="create-account-dialog"
                />
            </Drawer>
        );
    }
}

export const Sidebar = withRouter((p:PWithRouter) =>
    <PureSidebar onChange={(e, url) => p.router.push(url)} />);
