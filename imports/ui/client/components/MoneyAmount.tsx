import * as React from 'react';

interface P {
    amount: Number
    editable?: boolean
}

export const MoneyAmount = ({amount}: P) => <span className="money-amount">{amount} Ft</span>;