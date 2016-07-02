import {AccountCollection} from '../../../api/accounts/index';
import {createContainer} from "meteor/react-meteor-data";
import {SidebarAccountsList} from "../components/index";

export const SidebarAccountsListContainer = createContainer(
    function () {
        const handle = Meteor.subscribe('accounts');
        return {
            loading: !handle.ready(),
            accounts: AccountCollection.find().fetch()
        }
    },
    SidebarAccountsList
);