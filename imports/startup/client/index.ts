import * as injectTapEventPlugin from 'react-tap-event-plugin';
import {Logger} from "./Logger";
import './routes.tsx'
import '../../api/accounts/client/methods.ts';

injectTapEventPlugin();

Meteor.startup(function () {
    Logger.info({type: 'application-started'});
});

