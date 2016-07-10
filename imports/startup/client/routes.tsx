import * as React from 'react'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'

import { history } from './history';
import {
    OtpImportLogListPage, BudgetPage, LoginPage, AccountSettingsPage, OtpImportLogDetailsPage,
    TransactionsPage
} from "../../ui/client/pages/index.ts"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Logger} from "./Logger";

// Auth check for everything but the login page
function requireAuth(nextState, replace, cb) {
    Meteor.call('isAuthed', function (err, result) {
        if (err || !result) {
            Logger.info({type: 'redirect', to: '/login', reason: 'not-authed'});
            replace({
                pathname: '/login',
                state: {nextPathname: nextState.location.pathname}
            });
        }
        cb();
    });
}

// Auth check for the login page
function redirectIfAuthed(nextState, replace, cb) {
    Meteor.call('isAuthed', function (err, result) {
        if (!err && result) {
            replace({
                pathname: '/',
            });
            cb();
        } else {
            cb();
        }
    });
}

// Log all navigation events
history.listen(function (location: Location) {
    Logger.info({type: 'routing', path: location.pathname, search: location.search});
});

// Redirect to / on successful login
var loggedIn = !! Meteor.userId();
Tracker.autorun(function () {
    const nowLoggedIn = !! Meteor.userId();
    if (!loggedIn && nowLoggedIn) {
        Logger.info({type: 'redirect', to: '/', reason: 'just-logged-in'});
        history.push('/');
    }
    loggedIn = nowLoggedIn;
});

// And finally, the actual routes
Meteor.startup(() =>
    render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router history={history}>
              <Route path="/login" component={LoginPage} onEnter={redirectIfAuthed} />
              <Route path="/" onEnter={requireAuth}>
                  <IndexRoute component={BudgetPage}/>
                  <Route path="/otp/:importLogId" component={OtpImportLogDetailsPage}/>
                  <Route path="/otp" component={OtpImportLogListPage}/>
                  <Route path="/account" component={TransactionsPage}/>
                  <Route path="/account/:accountId/settings" component={AccountSettingsPage}/>
              </Route>
          </Router>
      </MuiThemeProvider>
    ), document.getElementById("root"))
);
