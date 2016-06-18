import * as React from 'react';
import {createContainer} from "meteor/react-meteor-data";

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {
    SuperCategory, Category, isCategory, SuperCategoryCollection, CategoryCollection,
    isSuperCategory
} from "../../../api/categories/index";
import {CategoryRow, SuperCategoryRow} from "../components/index"

type RowData = Category | SuperCategory;
interface P {
    rows: RowData[]
}

function moveCategory(source: Category, target: Category) {
    Meteor.call('budget.move-category', source, target);
}

function moveSuperCategory(source: SuperCategory, target: SuperCategory) {
    Meteor.call('budget.move-super-category', source, target);
}

function moveToTop(category: Category, superCategory: SuperCategory) {
    const firstNewSiblingCategory = CategoryCollection.findOne({superCategoryId: superCategory._id}, {sort: {budgetSortIndex: 1}});
    if (firstNewSiblingCategory == null) {
        CategoryCollection.update(category._id, {$set: {superCategoryId: superCategory._id, budgetSortIndex: 0}});
    } else {
        moveCategory(category, firstNewSiblingCategory);
    }
}

function moveToBottom(category: Category, superCategory: SuperCategory) {
    const lastNewSiblingCategory = CategoryCollection.findOne({superCategoryId: superCategory._id}, {sort: {budgetSortIndex: -1}});
    if (lastNewSiblingCategory == null) {
        CategoryCollection.update(category._id, {$set: {superCategoryId: superCategory._id, budgetSortIndex: 0}});
    } else {
        CategoryCollection.update(category._id, {$set: {superCategoryId: superCategory._id, budgetSortIndex: lastNewSiblingCategory.budgetSortIndex + 1}});
    }
}

function renderRow(row: RowData) {
    if (isSuperCategory(row)) {
        return (<SuperCategoryRow superCategory={row} key={row._id}
                                  moveSuperCategory={moveSuperCategory}
                                  moveToTop={moveToTop}
                                  moveToBottom={moveToBottom}
        />);
    } else if (isCategory(row)) {
        return (<CategoryRow category={row} key={row._id} moveCategory={moveCategory} />);
    }
}

export const BudgetCategoriesGriddle = DragDropContext(HTML5Backend)(
    createContainer<P>(() => {
        Meteor.subscribe("categories");
        Meteor.subscribe("supercategories");
        const rows: RowData[] = [];
        SuperCategoryCollection.find({}, {sort: {budgetSortIndex: 1}}).fetch().forEach((superCategory: SuperCategory) => {
            rows.push(superCategory);
            CategoryCollection.find({superCategoryId: superCategory._id}, {sort: {budgetSortIndex: 1}}).fetch().forEach((category: Category) => {
                rows.push(category);
            });
        });
        return {
            rows: rows
        }
    }, ({rows}: P) => <table className="budget">
        <thead>
        <tr>
            <th>CATEGORY</th>
            <th>ACTIVITY</th>
            <th>AVAILABLE</th>
        </tr>
        </thead>
        <tbody>
        {rows.map(renderRow)}
        </tbody>
    </table>)
);

/*
function onChangeHandler(item: Category | SuperCategory) {
    if (isCategory(item)) {
        return function({newName}) {
            console.log('category', item, newName);
        }
    } else {
        return function({newName}) {
            console.log('supercategory', item, newName);
        }
    }
}

const columnMetadata: ColumnMetaData<SuperCategoryWithChildren>[] = [
    {
        columnName: 'name',
        displayName: 'Name',
        customComponent: p => <RIEInput value={p.data} change={onChangeHandler(p.rowData)} propName="newName"/>
    }
];

type TypedGriddle = new() => React.Component<GriddleProps<SuperCategoryWithChildren>, {}>;
const TypedGriddle = Griddle as any as TypedGriddle;

export const BudgetCategoriesGriddle = createContainer<P>(() => {
    const categoriesHandle = Meteor.subscribe("categories");
    const superCategoriesHandle = Meteor.subscribe("supercategories");
    const superCategoryWithChildren = SuperCategoryCollection.find({}).fetch().map((superCategory: SuperCategory) => {
        var withChildren = superCategory as SuperCategoryWithChildren;
        withChildren.children = CategoryCollection.find({superCategoryId: superCategory._id}).fetch();
        return withChildren;
    });
    return {
        superCategoriesWithChildren: superCategoryWithChildren
    }
}, ({superCategoriesWithChildren}: P) => <TypedGriddle
    enableSort={false} results={superCategoriesWithChildren}
    columns={['name']}
    columnMetadata={columnMetadata}
    />);
*/
