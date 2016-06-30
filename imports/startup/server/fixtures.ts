import {skipAuthentication} from './auth';
import {CategoryCollection, SuperCategoryCollection} from "../../api/categories/index";
import {OtpCsvLineHashCollection, OtpImportLogCollection} from "../../api/otp/index";
import {Logger} from "../server/Logger";

if (skipAuthentication) {
    Meteor.methods({
        'fixtures.reset-database': function () {
            Logger.info(this, 'Resetting database');
            [CategoryCollection, SuperCategoryCollection, OtpCsvLineHashCollection, OtpImportLogCollection].forEach(
                (coll) => coll.remove({})
            );
        }
    });
}