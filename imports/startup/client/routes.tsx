import * as React from 'react'
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'

import {OtpImportLogListPage, BudgetPage} from "../../ui/client/pages/index.ts"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AccountsUIWrapper from "../../ui/client/components/AccountsUIWrapper";
import {isAuthed} from "../../auth";

function requireAuth(nextState, replace) {
    if (!isAuthed()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

Meteor.startup(() =>
    render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router history={browserHistory}>
              <Route path="/login" component={AccountsUIWrapper}/>
              <Route path="/" onEnter={requireAuth}>
                  <IndexRedirect to="/budget" />
                  <Route path="otp" component={OtpImportLogListPage}/>
                  <Route path="budget" component={BudgetPage}/>
              </Route>
          </Router>
      </MuiThemeProvider>
    ), document.getElementById("root"))
);
