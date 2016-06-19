import * as React from 'react'

import {Table, TableHeader, TableBody} from "material-ui/Table"
import {Dialog} from "material-ui"

import {OtpImportLog, OtpImportLogEntry} from "../../../api/otp/index.ts"
import {OtpImportLogEntryTableRow, OtpImportLogEntryTableHeader} from "../components/index.ts"

export interface P {
    loaded: boolean
    importLog: OtpImportLog
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

    renderDialogContent() {
        if (this.state.entryForDialog == null) {
            return null;
        }
        return <pre>{JSON.stringify(this.state.entryForDialog.line, null, 4)}</pre>;
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
                    {this.renderDialogContent()}
                </Dialog>
                <Table className="otp-import-log-details-table">
                    <TableHeader>
                        <OtpImportLogEntryTableHeader/>
                    </TableHeader>
                    <TableBody>
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

