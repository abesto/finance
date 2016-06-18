import * as React from 'react';
import {Dialog, RaisedButton, FlatButton, TextField} from 'material-ui';

interface P {
    title: string
    description: string
    okButtonLabel: string
    onOk: (string) => void
}

interface S {
    open: boolean
}

export class TextInputDialog extends React.Component<P, S> {
    input: TextField;

    constructor(p, c) {
        super(p, c);
        this.state = {open: false};
    }

    open = () => {
        this.setState({open: true});
    };

    close = () => this.setState({open: false});

    handleOk = () => {
        this.props.onOk(this.input.getValue());
        this.close();
    };

    handleKeyDown = (evt) => {
        if (evt.keyCode == 13) {
            this.handleOk();
        }
    };

    inputMounted = (input: TextField) => {
        this.input = input;
        if (this.input != null) {
            this.input.focus();
        }
    };

    render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.close}/>,
            <RaisedButton label={this.props.okButtonLabel} primary={true} onClick={this.handleOk} />
        ];

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                open={this.state.open}
                onRequestClose={this.close}
            >
                <p>{this.props.description}</p>
                <TextField
                    fullWidth={true}
                    ref={this.inputMounted}
                    name={"text-input-dialog-" + Math.random()}
                    onKeyDown={this.handleKeyDown}
                />
            </Dialog>
        );
    }
}