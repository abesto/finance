import * as React from 'react'

import {AppBar} from 'material-ui'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';

import {OtpImportActionComponent, Sidebar, Content} from "../components/index"
import {OtpImportLogList} from "../containers/OtpImportLogList";

const addButtonStyle = {
    position: 'fixed',
    right: 20,
    bottom: 20
};

export class OtpImportLogListPage extends React.Component<{}, {}> {
    constructor() {
        super();
        this.startImport = this.startImport.bind(this);
    }

    startImport() {
        const importer: OtpImportActionComponent = this.refs["importer"] as OtpImportActionComponent;
        importer.startImport()
    }

    render() {
        return (
            <div className="otp-import-log-list-page">
                <Sidebar/>

                <Content>
                    <AppBar title="OTP Import" iconElementLeft={<span/>}/>
                    <OtpImportLogList />
                </Content>

                <OtpImportActionComponent ref="importer"/>
                <FloatingActionButton
                    id="otp-import-upload-button"
                    style={addButtonStyle}
                    onClick={this.startImport}
                >
                    <FileUploadIcon/>
                </FloatingActionButton>
            </div>
        );
    }
}

