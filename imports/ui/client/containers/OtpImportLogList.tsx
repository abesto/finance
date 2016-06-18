import * as React from 'react';
import {createContainer} from "meteor/react-meteor-data"

import {OtpImportLogCollection} from "../../../api/otp/index"
import {OtpImportLogCard} from "../components/index"

export const OtpImportLogList = createContainer(
    () => {
        Meteor.subscribe('otp.importlogs');
        return {
            logs: OtpImportLogCollection.find({}, {sort: {importedAt: -1}}).fetch()
        }
    },
    props =>
        <div className="otp-import-log-list">
            {props.logs.map(item =>
                <OtpImportLogCard item={item} key={item._id}/>
            )}
        </div>);

