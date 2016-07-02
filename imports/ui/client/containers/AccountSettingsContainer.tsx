import {AccountCollection, Account} from '../../../api/accounts/index';
import {createContainer} from "meteor/react-meteor-data";
import {AccountSettings} from "../components/index";

interface PI {
    accountId: string
}

interface PO {
    loading: boolean
    account: Account
}

export const AccountSettingsContainer = createContainer<PI, PO>(
    function (props: PI) {
        const handle = Meteor.subscribe('accounts.single', props.accountId);
        return {
            loading: !handle.ready(),
            account: AccountCollection.findOne(props.accountId)
        }
    },
    AccountSettings
);