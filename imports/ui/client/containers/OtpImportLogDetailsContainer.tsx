import * as React from 'react'
import {createContainer} from "meteor/react-meteor-data";
import {OtpImportLogCollection} from "../../../api/otp/index";
import {OtpImportLogDetails} from "../components/OtpImportLogDetails";

interface P {
    importLogId: string
    showMetadata?: boolean
}

export const OtpImportLogDetailsContainer = createContainer((p: P) => {
    const handle = Meteor.subscribe('otp.importLogs.single', p.importLogId);
    return {
        loaded: handle.ready(),
        importLog: OtpImportLogCollection.findOne(p.importLogId)
    };
}, OtpImportLogDetails);

