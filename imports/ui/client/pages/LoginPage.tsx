import * as React from 'react'
import {AppBar, Paper} from 'material-ui'
import {AccountsUIWrapper} from '../components/AccountsUIWrapper'

export const LoginPage = () => <div className="login-page">
    <AppBar
        title="WNAB"
        iconElementLeft={<span/>}
    />

    <Paper style={{width: '40%', height: '50%', margin: 'auto', padding: 30, textAlign: 'center'}}>
        <AccountsUIWrapper/>
    </Paper>
</div>;