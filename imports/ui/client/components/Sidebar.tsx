import * as React from 'react';
import {withRouter, IRouter} from 'react-router';
import {Drawer, ListItem, Divider, Subheader, MakeSelectable, List} from 'material-ui';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import BalanceIcon from 'material-ui/svg-icons/action/account-balance';

import {WnabAppBar} from './WnabAppBar';

const SelectableList = MakeSelectable(List);

interface PPure {
    onChange: (e, value: any) => void
}

interface PWithRouter extends PPure {
    router: IRouter
}

function PureSidebar({onChange}: PPure) {
    return (
        <Drawer docked={true} id="sidebar">
            <WnabAppBar/>
            <SelectableList onChange={onChange} value={location.pathname}>
                <ListItem id="nav-budget" leftIcon={<EmailIcon/>} primaryText="Budget" value="/budget" />
                <ListItem id="nav-all-accounts" leftIcon={<BalanceIcon/>} primaryText="All Accounts" />
                <ListItem id="nav-otp" leftIcon={<CloudUploadIcon/>} value="/otp" primaryText="OTP Import" />
                <Divider/>
                <Subheader>Accounts</Subheader>
                <ListItem>Placeholder 1</ListItem>
                <ListItem>Placeholder 2</ListItem>
            </SelectableList>
        </Drawer>
    );
}

export const Sidebar = withRouter((p:PWithRouter) =>
    <PureSidebar onChange={(e, url) => p.router.push(url)} />);
