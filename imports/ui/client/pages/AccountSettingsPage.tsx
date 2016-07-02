import * as React from 'react'

import {AppBar} from 'material-ui'

import {Sidebar, Content} from "../components/index"
import {AccountSettingsContainer} from "../containers/index"

interface P {
    params: {
        accountId: string
    }
}

export const AccountSettingsPage = (props: P) =>
    <div className="account-settings-page">
        <Sidebar />

        <Content>
            <AppBar title="Account Settings" iconElementLeft={<span/>}/>
            <div style={{padding: 30}}>
                <AccountSettingsContainer accountId={props.params.accountId} />
            </div>
        </Content>
    </div>;
