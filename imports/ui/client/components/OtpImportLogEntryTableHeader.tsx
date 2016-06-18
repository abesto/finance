import * as React from 'react';
import {TableRow, TableHeaderColumn} from "material-ui/Table"

export const OtpImportLogEntryTableHeader = () =>
    <TableRow>
        <TableHeaderColumn>Account Number</TableHeaderColumn>
        <TableHeaderColumn>Entered</TableHeaderColumn>
        <TableHeaderColumn>Cleared</TableHeaderColumn>
        <TableHeaderColumn>Income / Expense</TableHeaderColumn>
        <TableHeaderColumn>Amount</TableHeaderColumn>
        <TableHeaderColumn>Partner Name</TableHeaderColumn>
        <TableHeaderColumn>Memo</TableHeaderColumn>
        <TableHeaderColumn>Transaction Type</TableHeaderColumn>
    </TableRow>;

