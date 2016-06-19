import * as React from 'react'
import {findDOMNode} from 'react-dom'
import {OtpImportLogCollection} from "../../../api/otp/index";
import {Logger} from "../../../startup/client/Logger";

interface P {
    onDone?: (OtpImportLog) => any
}

export class OtpImportActionComponent extends React.Component<P, {}>{
    constructor(p) {
        super(p);
        this.onChange = this.onChange.bind(this);
        this.startImport = this.startImport.bind(this);
    }

    startImport() {
        Logger.info({type: 'ui', flow: 'otp-import', event: 'clicked-start'});
        findDOMNode<HTMLInputElement>(this.refs["fileInput"]).click();
    }

    onChange(evt) {
        if (evt.target.files.length === 0) {
            Logger.info({type: 'ui', flow: 'otp-import', event: 'cancelled'});
            return;
        }
        Logger.info({type: 'ui', flow: 'otp-import', event: 'file-selected', file: evt.target.files[0].name});
        const file: File = evt.target.files[0];
        const content = file.slice(0, file.size);
        const reader = new FileReader();

        reader.addEventListener("loadend", () => {
            Logger.info({type: 'ui', flow: 'otp-import', event: 'file-loaded', content: reader.result});
            Meteor.call("otp/import-csv", reader.result, (err, importLogId) => {
                if (err) {
                    Logger.info({type: 'ui', flow: 'otp-import', event: 'call-failed', error: err});
                    alert(err);
                } else if (this.props.onDone != null) {
                    this.props.onDone(OtpImportLogCollection.findOne(importLogId));
                    Logger.info({type: 'ui', flow: 'otp-import', event: 'done'});
                }
            });
        });
        reader.readAsText(content);
    };

    render() {
        return <input
                style={{display: 'none'}}
                ref="fileInput"
                type="file"
                onChange={this.onChange}
            />
    }
}

