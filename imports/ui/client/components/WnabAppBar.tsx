import * as React from 'react';
import {AppBar, IconMenu, MenuItem, IconButton} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Logger} from "../../../startup/client/Logger";
import {history} from "../../../startup/client/history";

function logout() {
    Logger.info({type: 'ui', flow: 'logout', event: 'clicked-logout'});
    Meteor.logout(function (err) {
        if (err) {
            Logger.error({type: 'ui', flow: 'logout', event: 'logout-filed', error: err});
        } else {
            Logger.info({type: 'ui', flow: 'logout', event: 'done'});
            history.push('/login');
        }
    })
}

export const WnabAppBar = () =>
    <AppBar title="WNAB" iconElementLeft={
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon color="white"/></IconButton>
        }
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      >
        <MenuItem primaryText="Sign out" onClick={logout} />
      </IconMenu>
    }/>;