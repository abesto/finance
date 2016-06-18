import * as React from 'react';
import {withRouter, IRouter} from 'react-router';
import {Drawer, ListItem, Divider, Subheader, MakeSelectable, List} from 'material-ui';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import BalanceIcon from 'material-ui/svg-icons/action/account-balance';

const SelectableList = MakeSelectable(List);

interface PPublic {
    appBar: JSX.Element
}

interface PPure extends PPublic {
    onChange: (e, value: any) => void
}

interface PWithRouter extends PPure {
    router: IRouter
}

function PureSidebar({appBar, onChange}: PPure) {
    return (
        <Drawer docked={true}>
            {appBar}
            <SelectableList onChange={onChange} value={location.pathname}>
                <ListItem leftIcon={<EmailIcon/>} primaryText="Budget" value="/budget" />
                <ListItem leftIcon={<BalanceIcon/>} primaryText="All Accounts" />
                <ListItem leftIcon={<CloudUploadIcon/>} value="/otp" primaryText="OTP Import" />
                <Divider/>
                <Subheader>Accounts</Subheader>
                <ListItem>Placeholder 1</ListItem>
                <ListItem>Placeholder 2</ListItem>
            </SelectableList>
        </Drawer>
    );
}

export const Sidebar = withRouter<PPublic>((p:PWithRouter) =>
    <PureSidebar appBar={p.appBar} onChange={(e, url) => p.router.push(url)} />);
