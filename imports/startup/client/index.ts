import './routes.tsx'
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import {Logger} from "./Logger";

injectTapEventPlugin();

Meteor.startup(function () {
    Logger.info({type: 'application-started'});
});

