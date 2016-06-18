import * as React from 'react'
import {findDOMNode} from 'react-dom'
import {OtpImportLogCollection} from "../../../api/otp/index";

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
        findDOMNode<HTMLInputElement>(this.refs["fileInput"]).click();
    }

    onChange(evt) {
        if (evt.target.files.length === 0) {
            return;
        }
        const file: File = evt.target.files[0];
        const content = file.slice(0, file.size);
        const reader = new FileReader();

        reader.addEventListener("loadend", () => {
            Meteor.call("otp/import-csv", reader.result, (err, importLogId) => {
                if (err) {
                    alert(err);
                } else if (this.props.onDone != null) {
                    this.props.onDone(OtpImportLogCollection.findOne(importLogId));
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

