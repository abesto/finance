import * as React from 'react'
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'

import {OtpImportLogListPage, BudgetPage} from "../../ui/client/pages/index.ts"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AccountsUIWrapper from "../../ui/client/components/AccountsUIWrapper";

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

browserHistory.listen(function (location: Location) {
    Meteor.call('log.info', {type: 'routing', path: location.pathname, search: location.search});
});

Meteor.startup(() =>
    render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router history={browserHistory}>
              <Route path="/login" component={AccountsUIWrapper} onEnter={redirectIfAuthed} />
              <Route path="/" onEnter={requireAuth}>
                  <IndexRedirect to="/budget" />
                  <Route path="otp" component={OtpImportLogListPage}/>
                  <Route path="budget" component={BudgetPage}/>
              </Route>
          </Router>
      </MuiThemeProvider>
    ), document.getElementById("root"))
);
