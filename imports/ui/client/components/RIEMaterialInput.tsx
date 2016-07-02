import {RIEInput} from "riek";
import {TextField} from "material-ui";
import {findDOMNode} from "react-dom";
import * as React from "react";

interface EP {
    inputName: string
}

// Extend the input component provided by RIEK to use a material-ui input field
export class RIEMaterialInput extends RIEInput<EP> {
    setInput = (textField: TextField) => {
        if (textField == null) {
            this.refs["input"] = null;
        } else {
            this.refs = {input: findDOMNode(textField).firstChild as HTMLInputElement};
        }
    };

    renderEditingComponent = () =>
        <TextField
            disabled={this.state.loading}
            className={this.makeClassString()}
            defaultValue={this.props.value}
            onChange={this.textChanged}
            onBlur={this.finishEditing}
            ref={this.setInput}
            onKeyDown={this.keyDown}
            style={{fontSize: 25}}
            name={this.props.inputName}
        />;
}

