import * as React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'

import {OtpImportLogListPage, BudgetPage} from "../../ui/client/pages/index.ts"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

Meteor.startup(() =>
    render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router history={browserHistory}>
              <Route path="/">
                  <IndexRedirect to="/budget" />
                  <Route path="otp" component={OtpImportLogListPage}/>
                  <Route path="budget" component={BudgetPage}/>
              </Route>
          </Router>
      </MuiThemeProvider>
    ), document.getElementById("root"))
);
