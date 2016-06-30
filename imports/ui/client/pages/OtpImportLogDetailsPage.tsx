import * as React from 'react'

import {AppBar} from 'material-ui'

import {Sidebar, Content} from "../components/index"
import {OtpImportLogDetailsContainer} from "../containers/index"

interface P {
    params: {
        importLogId: string
    }
}

export const OtpImportLogDetailsPage = (props: P) =>
    <div className="otp-import-log-details-page">
        <Sidebar />

        <Content>
            <AppBar title={"OTP Import details / " + props.params.importLogId} iconElementLeft={<span/>}/>
            <OtpImportLogDetailsContainer importLogId={props.params.importLogId} showMetadata={true} />
        </Content>
    </div>;
