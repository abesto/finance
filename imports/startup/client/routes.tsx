import * as React from 'react'
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'

import { history } from './history';
import {OtpImportLogListPage, BudgetPage, LoginPage} from "../../ui/client/pages/index.ts"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {OtpImportLogDetailsPage} from "../../ui/client/pages/OtpImportLogDetailsPage";

function requireAuth(nextState, replace, cb) {
    Meteor.call('isAuthed', function (err, result) {
        if (err || !result) {
            replace({
                pathname: '/login',
                state: { nextPathname: nextState.location.pathname }
            });
            cb();
        } else {
            cb();
        }
    });
}

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

history.listen(function (location: Location) {
    Meteor.call('log.info', {type: 'routing', path: location.pathname, search: location.search});
});

Accounts.onLogin(() => history.push("/"));

Meteor.startup(() =>
    render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router history={history}>
              <Route path="/login" component={LoginPage} onEnter={redirectIfAuthed} />
              <Route path="/" onEnter={requireAuth}>
                  <IndexRoute component={BudgetPage}/>
                  <Route path="/otp/:importLogId" component={OtpImportLogDetailsPage}/>
                  <Route path="/otp" component={OtpImportLogListPage}/>
              </Route>
          </Router>
      </MuiThemeProvider>
    ), document.getElementById("root"))
);
