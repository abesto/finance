import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

interface S {
    view: Blaze.View
}

export default class AccountsUIWrapper extends React.Component<{}, S> {
    constructor() {
        super();
        this.state = {view: null};
        this.renderBlaze = this.renderBlaze.bind(this);
    }

    renderBlaze(span) {
        if (span == null) {
            if (this.state.view) {
                Blaze.remove(this.state.view);
                this.setState({view: null});
            }
        } else {
            this.renderBlaze(null);
            this.setState({
                view: Blaze.render(Template["loginButtons"], ReactDOM.findDOMNode(span))
            });
        }
    }

    render() {
        // Just render a placeholder container that will be filled in
        return <span ref={this.renderBlaze} />;
    }
}

