import {skipAuthentication} from './auth';
import {CategoryCollection, SuperCategoryCollection} from "../../api/categories/index";
import {OtpCsvLineHashCollection, OtpImportLogCollection} from "../../api/otp/index";
import {Logger} from "../server/Logger";
import {AccountCollection} from "../../api/accounts/index";

if (skipAuthentication) {
    Meteor.methods({
        'fixtures.reset-database': function () {
            Logger.info(this, {type: 'fixture', name: 'reset-database'});
            [
                CategoryCollection, SuperCategoryCollection, OtpCsvLineHashCollection, OtpImportLogCollection,
                AccountCollection
            ].forEach(
                (coll) => coll.remove({})
            );
        }
    });
}