import * as React from 'react';
import {AppBar, FlatButton} from "material-ui";
import AddIcon from 'material-ui/svg-icons/content/add';

import {BudgetCategoriesGriddle} from "../containers/BudgetCategoriesGriddle";
import {BudgetAppBar, Sidebar, Content} from "../components/index";
import {TextInputDialog} from "../components/TextInputDialog";
import {SuperCategoryCollection} from "../../../api/categories/index";

export class BudgetPage extends React.Component<{}, {}> {
    createSuperCategory(name) {
        return Meteor.call('budget.create-super-category', name);
    }

    render() {
        return (<div className="budget-page">
            <TextInputDialog
                ref="create-category-group-dialog"
                title="New Category Group"
                description="Category group name:"
                okButtonLabel="Create"
                onOk={this.createSuperCategory}
            />
            <AppBar iconElementRight={
                <FlatButton label="Category Group" icon={<AddIcon />} onClick={() => (this.refs["create-category-group-dialog"] as TextInputDialog).open()} />
            }/>
            <Sidebar appBar={<BudgetAppBar/>}/>
            <Content>
                <BudgetCategoriesGriddle/>
            </Content>
        </div>);
    }
}