import * as numeral from 'numeral'
import * as moment from 'moment'
import * as React from 'react';
import {TableRow, TableRowColumn} from "material-ui/Table"
import TableRowProps = __MaterialUI.Table.TableRowProps;

import {OtpImportLogEntry, OtpIncomeOrExpense} from "../../../api/otp/index";

interface P {
    item: OtpImportLogEntry
    onClick: (OtpImportLogEntry) => any
}

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

function formatAmount(amount) {
    return numeral(amount).format('1,000');
}

function formatCurrency(amount, currency) {
    if (currency === '$') {
        return currency + amount;
    }
    return amount + ' ' + currency;
}

type ClickableTableRow = new() => React.Component<TableRowProps & {onClick: () => void}, {}>;
const ClickableTableRow = TableRow as ClickableTableRow;

export const OtpImportLogEntryTableRow = ({item, onClick}: P) =>
    // TODO: move onClick Table#onCellClick once https://github.com/callemall/material-ui/issues/1783 is fixed
    <ClickableTableRow onClick={() => onClick(item)}>
        <TableRowColumn>{item.line.account}</TableRowColumn>
        <TableRowColumn>{formatDate(item.line.dateEntered)}</TableRowColumn>
        <TableRowColumn>{formatDate(item.line.dateCleared)}</TableRowColumn>
        <TableRowColumn>{item.line.incomeOrExpense == OtpIncomeOrExpense.Income ? "Income" : "Expense"}</TableRowColumn>
        <TableRowColumn>{formatCurrency(formatAmount(item.line.amount), item.line.currency)}</TableRowColumn>
        <TableRowColumn>{item.line.partnerName}</TableRowColumn>
        <TableRowColumn>{item.line.memo} {item.line.memo2} {item.line.memo3}</TableRowColumn>
        <TableRowColumn>{item.line.transactionType}</TableRowColumn>
    </ClickableTableRow>;

