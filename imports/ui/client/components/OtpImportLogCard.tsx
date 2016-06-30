import * as React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import {OtpImportLog, msgNEntriesImportedAt, msgImportInterval} from "../../../api/otp/index";
import {OtpImportLogDetails} from "./OtpImportLogDetails";

interface P {
    item: OtpImportLog
}

export const OtpImportLogCard = ({item}: P) => {
    if (item.entries.length == 0) {
        return null;
    }
    return (
        <Card className="otp-import-log-card">
            <CardHeader
                className="otp-import-log-card-header"
                title={msgImportInterval(item)}
                subtitle={msgNEntriesImportedAt(item)}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardText expandable={true}>
                <OtpImportLogDetails importLog={item} loaded={true}/>
            </CardText>
        </Card>
    );
};

