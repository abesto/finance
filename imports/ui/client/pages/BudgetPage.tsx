import * as React from 'react';
import {AppBar, FlatButton} from "material-ui";
import AddIcon from 'material-ui/svg-icons/content/add';

import {BudgetCategoriesGriddle} from "../containers/BudgetCategoriesGriddle";
import {BudgetAppBar, Sidebar, Content} from "../components/index";
import {TextInputDialog} from "../components/TextInputDialog";
import {Logger} from "../../../startup/client/Logger";

export class BudgetPage extends React.Component<{}, {}> {
    dialog: TextInputDialog;

    handleClickeDCreateCategoryGroup = () => {
        Logger.info({type: 'ui', flow: 'create-super-category', event: 'clicked-start'});
        this.dialog.open();
    };

    createSuperCategory(name) {
        Logger.info({type: 'ui', flow: 'create-super-category', event: 'clicked-create', name: name});
        Meteor.call('budget.create-super-category', name, (err, res) => {
            if (err) {
                Logger.info({type: 'ui', flow: 'create-super-category', event: 'call-failed', name: name, error: err});
            } else {
                Logger.info({type: 'ui', flow: 'create-super-category', event: 'done', name: name, createdId: res});
            }
        });
    }

    render() {
        return (<div className="budget-page">
            <TextInputDialog
                ref={(dlg) => this.dialog = dlg}
                title="New Category Group"
                description="Category group name:"
                okButtonLabel="Create"
                onOk={this.createSuperCategory}
            />
            <AppBar iconElementRight={
                <FlatButton label="Category Group" icon={<AddIcon />} onClick={this.handleClickeDCreateCategoryGroup} />
            }/>
            <Sidebar appBar={<BudgetAppBar/>}/>
            <Content>
                <BudgetCategoriesGriddle/>
            </Content>
        </div>);
    }
}