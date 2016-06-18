import * as moment from 'moment';
import * as React from 'react';
import * as _ from 'lodash';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import {OtpImportLog} from "../../../api/otp/index";
import {OtpImportLogDetails} from "./OtpImportLogDetails";

interface P {
    item: OtpImportLog
}

function itemCount(item: OtpImportLog) {
    return item.entries ? item.entries.length : 0;
}

export const OtpImportLogCard = ({item}: P) => {
    if (item.entries.length == 0) {
        return null;
    }
    var title;
    var from = moment(_.first(item.entries).line.dateEntered).format('YYYY-MM-DD');
    var until = moment(_.last(item.entries).line.dateEntered).format('YYYY-MM-DD');
    if (from == until) {
        title = from;
    } else {
        title = from + " to " + until;
    }
    return (
        <Card>
            <CardHeader
                title={title}
                subtitle={itemCount(item) + ' entries imported at ' + moment(item.importedAt).format('YYYY-MM-DD HH:mm')}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardText expandable={true}>
                <OtpImportLogDetails importLog={item} loaded={true}/>
            </CardText>
        </Card>
    );
};

