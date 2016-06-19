import {skipAuthentication} from './auth';
import {CategoryCollection, SuperCategoryCollection} from "../../api/categories/index";
import {OtpCsvLineCollection, OtpImportLogCollection} from "../../api/otp/index";
import {Logger} from "../server/Logger";

if (skipAuthentication) {
    Meteor.methods({
        'fixtures.reset-database': function () {
            Logger.info(this, 'Resetting database');
            [CategoryCollection, SuperCategoryCollection, OtpCsvLineCollection, OtpImportLogCollection].forEach(
                (coll) => coll.remove({})
            );
        }
    });
}