import * as React from 'react';
import * as _ from 'lodash';
import {findDOMNode} from 'react-dom';
import {RIEInput} from 'riek';
import {DragSource, DragSourceSpec, DropTarget, DropTargetSpec} from "react-dnd";

import {SuperCategory, SuperCategoryCollection, CategoryCollection, Category} from "../../../api/categories/index";
import {MoneyAmount} from "./MoneyAmount";
import {DndTypes} from "../DndTypes";

interface P {
    superCategory: SuperCategory
    moveToTop: (c: Category, s: SuperCategory) => void
    moveToBottom: (c: Category, s: SuperCategory) => void
    moveSuperCategory: (source: SuperCategory, target: SuperCategory) => void
}

function hoverWithCategory(props, monitor, component) {
    const draggedCategory: Category = CategoryCollection.findOne(monitor.getItem()._id);
    const originalSuperCategory: SuperCategory = SuperCategoryCollection.findOne(draggedCategory.superCategoryId);
    const hoveredSuperCategory: SuperCategory = props.superCategory;

    const draggingOntoOwnSuperCategory = draggedCategory.superCategoryId == hoveredSuperCategory._id;

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (draggingOntoOwnSuperCategory && hoverClientY < hoverMiddleY) {
        // Dragging upwards past half my own super-category, I'm going to the very end of the previous super-category
        const newSuperCategory = SuperCategoryCollection.findOne(
            {budgetSortIndex: {$lt: hoveredSuperCategory.budgetSortIndex}},
            {sort: {budgetSortIndex: -1}}
        );
        if (newSuperCategory == null) {
            // I'm the first category. Nothing to do.
            return;
        }
        props.moveToBottom(draggedCategory, newSuperCategory);
    }
    if (!draggingOntoOwnSuperCategory && originalSuperCategory.budgetSortIndex < hoveredSuperCategory.budgetSortIndex && hoverClientY > hoverMiddleY) {
        // Dragging downwards past half of another super-category
        props.moveToTop(draggedCategory, hoveredSuperCategory);
    }
}

function hoverWithSuperCategory(props, monitor, component) {
    const draggedSuperCategory = SuperCategoryCollection.findOne(monitor.getItem()._id);
    const hoveredSuperCategory = props.superCategory;

    if (draggedSuperCategory._id == hoveredSuperCategory._id) {
        return;
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (draggedSuperCategory.budgetSortIndex < hoveredSuperCategory.budgetSortIndex && hoverClientY < hoverMiddleY) {
        return;
    }
    if (draggedSuperCategory.budgetSortIndex > hoveredSuperCategory.budgetSortIndex && hoverClientY > hoverMiddleY) {
        return;
    }
    props.moveSuperCategory(draggedSuperCategory, hoveredSuperCategory);
}

const rowSource: DragSourceSpec<P> = {
    beginDrag(props: P) {
        return {
            _id: props.superCategory._id,
            type: DndTypes.SUPER_CATEGORY_ROW
        };
    }
};

const rowTarget: DropTargetSpec<P> = {
    hover(props, monitor, component) {
        const type: string = monitor.getItem()["type"];
        if (type == DndTypes.CATEGORY_ROW) {
            hoverWithCategory(props, monitor, component);
        } else if (type == DndTypes.SUPER_CATEGORY_ROW) {
            hoverWithSuperCategory(props, monitor, component);
        } else {
            throw `Unknown DnD type ${type}`;
        }
    }
};

interface DndP extends P {
    connectDropTarget?: (e: JSX.Element) => JSX.Element
    connectDragSource?: (e: JSX.Element) => JSX.Element
}

class _SuperCategoryRow extends React.Component<DndP, {}> {
    rename = ({newName}) => {
        Meteor.call('budget.rename-super-category', this.props.superCategory._id, newName);
    };

    render() {
        const {connectDragSource, connectDropTarget, superCategory} = this.props;
        return connectDropTarget(connectDragSource(
            <tr className="super-category-row">
                <td>
                    <RIEInput className="editable-super-category-name" value={superCategory.name} propName="newName" change={this.rename}/>
                </td>
                <td><MoneyAmount amount={0}/></td>
                <td><MoneyAmount amount={0}/></td>
            </tr>
        ));
    }
}

export const SuperCategoryRow = _.flow(
    DropTarget([DndTypes.CATEGORY_ROW, DndTypes.SUPER_CATEGORY_ROW], rowTarget, connect => ({ connectDropTarget: connect.dropTarget() })),
    DragSource(DndTypes.SUPER_CATEGORY_ROW, rowSource, (connect, monitor) => ({ connectDragSource: connect.dragSource(), }))
)(_SuperCategoryRow);
