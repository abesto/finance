import * as React from 'react';
import * as moment from 'moment';
import {identity, extend} from 'lodash';
import { MeteorGriddle } from 'meteor/utilities:meteor-griddle';
import * as Dimensions from 'react-dimensions';

import * as Griddle from 'griddle-react';


import {TransactionCollection} from "../../../api/transactions/index";

function DateComponent(props) {
    return <span>{moment(props.data).format('YYYY-MM-DD')}</span>;
}

function CategoryComponent(categoryId) {
    return <span>N/A</span>;
}

function Simple(props) {
    return <span>{props.data}</span>
}

function Empty() {
    return <span></span>;
}

const columnMetadata = [
    {
        columnName: 'date',
        displayName: 'Date',
        cssClassName: 'date',
        customComponent: DateComponent
    },
    {
        columnName: 'payee',
        displayName: 'Payee',
        cssClassName: 'payee',
        customComponent: Simple
    },
    {
        columnName: 'categoryId',
        displayName: 'Category',
        cssClassName: 'category',
        customComponent: CategoryComponent
    },
    {
        columnName: 'memo',
        displayName: 'Memo',
        cssClassName: 'memo',
        customComponent: Simple
    },
    {
        columnName: 'amount',
        displayName: 'Amount',
        cssClassName: 'amount',
        customComponent: Simple
    }
];

/*
This hacked metadata, along with the hack-body and hack-header classes, work together to fix an issue where
in infinite scrolling mode, with fixedHeader=true the empty "padder" <tr> at the top of the scrollable table
kills any opportunity to set the <td>s width via CSS. https://github.com/GriddleGriddle/Griddle/pull/432 seems
to try to want to give a solution to the same problem.

This leads to us being unable to sort by clicking the header - the header that is visible is not the header attached to
the data table.
 */
const hiddenHeaderMetadata = columnMetadata.map(item => extend({}, item, {displayName: ''}));

@Dimensions({
    getHeight: (el) => $(window).height() - 64 - 23
})
class MeteorGriddleWithDimensions extends React.Component<any, any> {
    render() {
        return <MeteorGriddle {...this.props}
            bodyHeight={this.props.containerHeight}
        />;
    }
}

export const TransactionsContainer = () => <div className="transactions-container">
    <div className="hack-header">
        <Griddle useGriddleStyles={false}
                 columnMetadata={columnMetadata} columns={['date', 'payee', 'categoryId', 'memo', 'amount']}
                 enableSort={false}
                 results={[]}/>
    </div>

    <div className="hack-body">
        <MeteorGriddleWithDimensions
            // MeteorGriddle props
            publication="transactions"
            collection={TransactionCollection}
            matchingResultsCount="all-transactions"

            // Griddle props
            useGriddleStyles={false}
            enableInfiniteScroll={true}
            rowHeight={15.625} paddingHeight={4.2}  // Hints for infinite scrolling calculation, these values are based on the relevant CSS
            columnMetadata={hiddenHeaderMetadata} columns={['date', 'payee', 'categoryId', 'memo', 'amount']}
        />
    </div>
</div>;

