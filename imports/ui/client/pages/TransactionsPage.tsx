import * as React from 'react'

import {AppBar} from 'material-ui'

import {Sidebar, Content} from "../components/index"
import {TransactionsContainer} from "../containers/index"

interface P {
    params: {
        accountId: string
    }
}

export const TransactionsPage = (props: P) =>
    <div className="transactions-page">
        <Sidebar />

        <Content>
            <AppBar title="Transactions" iconElementLeft={<span/>}/>
            <div>
                <TransactionsContainer/>
            </div>
        </Content>
    </div>;
