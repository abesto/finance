import * as React from 'react';
import {TextField} from 'material-ui';

function onKeyDown(evt) {
    if (evt.keyCode == 13) {
        evt.target.blur();
    }
}

// Like Material-UI text field, except it blurs on return keypress. any onKeyDown prop passed in is ignored.
export const OurTextField = (props) => <TextField {...props} onKeyDown={onKeyDown} />;
