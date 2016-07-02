import * as React from 'react';
import * as formatters from "../../formatters";

interface P {
    amount: Number
    editable?: boolean
}

export const MoneyAmount = ({amount}: P) => <span className="money-amount">{formatters.money(amount)}</span>;