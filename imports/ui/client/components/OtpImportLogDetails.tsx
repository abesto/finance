import * as React from 'react'

import {Table, TableHeader, TableBody} from "material-ui/Table"
import {Dialog} from "material-ui"

import {history} from "../../../startup/client/history"
import {OtpImportLog, OtpImportLogEntry, msgImportInterval, msgNEntriesImportedAt} from "../../../api/otp/index.ts"
import {OtpImportLogEntryTableRow, OtpImportLogEntryTableHeader} from "../components/index.ts"

export interface P {
    loaded: boolean
    importLog: OtpImportLog
    showMetadata?: boolean
}

interface S {
    showDialog: boolean
    entryForDialog: OtpImportLogEntry
}

export class OtpImportLogDetails extends React.Component<P, S> {
    constructor(p) {
        super(p);
        this.state = {showDialog: false, entryForDialog: null};
        this.showDetails = this.showDetails.bind(this);
    }

    showDetails(entry) {
        this.setState({
            entryForDialog: entry,
            showDialog: true
        });
    }

    renderDuplicateDescription() {
        if (this.state.entryForDialog == null) {
            return null;
        }
        const entry = this.state.entryForDialog;
        if (entry.firstImportedIn == null) {
            return null;
        }
        return <div>
            <h3>Duplicate</h3>
            <p>This entry was first imported in <a
                href={"/otp/" + entry.firstImportedIn}
                onClick={function (e) { history.push("/otp/" + entry.firstImportedIn); e.preventDefault(); }}
            >
                {entry.importLogId}
            </a></p>
        </div>
    }

    renderRawData() {
        if (this.state.entryForDialog == null) {
            return null;
        }
        return <div>
            <h3>Raw data</h3>
            <pre>{JSON.stringify(this.state.entryForDialog.line, null, 4)}</pre>
        </div>;
    }
    
    renderMetadata() {
        if (!this.props.showMetadata) {
            return null;
        }
        const l = this.props.importLog;
        return <div className="otp-import-log-details-metadata">
            <h4>{msgNEntriesImportedAt(l)}</h4>
            <p>{msgImportInterval(l)}</p>
        </div>;
    }

    render() {
        if (!this.props.loaded) {
            return <p>Waiting for import log details...</p>;
        }
        return (
            <div className="otp-import-log-details">
                <Dialog
                    title="Transaction details"
                    open={this.state.showDialog}
                    onRequestClose={() => this.setState({showDialog: false, entryForDialog: null})}
                    autoScrollBodyContent={true}
                >
                    {this.renderDuplicateDescription()}
                    {this.renderRawData()}
                </Dialog>
                {this.renderMetadata()}
                <Table className="otp-import-log-details-table">
                    <TableHeader className="otp-import-log-details-table-header">
                        <OtpImportLogEntryTableHeader/>
                    </TableHeader>
                    <TableBody className="otp-import-log-details-table-body">
                        {this.props.importLog.entries.map(item =>
                            <OtpImportLogEntryTableRow
                                item={item}
                                key={item.line.raw.toString()}
                                onClick={this.showDetails}
                            />
                        )}
                    </TableBody>
                </Table>
            </div>);
    }
}

