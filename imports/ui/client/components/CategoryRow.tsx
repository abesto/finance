import * as React from 'react';
import * as _ from 'lodash';
import {findDOMNode} from 'react-dom';
import {RIEInput} from 'riek';
import {DragSource, DragSourceSpec, DropTarget, DropTargetSpec} from "react-dnd";

import {Category, CategoryCollection} from "../../../api/categories/index.ts";
import {MoneyAmount} from "./MoneyAmount";
import {DndTypes} from "../DndTypes";

interface P {
    category: Category
    moveCategory: (a: Category, b: Category) => void
}

const rowSource: DragSourceSpec<P> = {
    beginDrag(props: P) {
        return {
            _id: props.category._id,
            type: DndTypes.CATEGORY_ROW
        };
    }
};

const rowTarget: DropTargetSpec<P> = {
    hover(props, monitor, component) {
        const draggedCategory = CategoryCollection.findOne(monitor.getItem()["_id"]);
        const hoveredCategory = props.category;

        if (draggedCategory._id == hoveredCategory._id) {
            return;
        }
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (draggedCategory.budgetSortIndex < hoveredCategory.budgetSortIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        if (draggedCategory.budgetSortIndex > hoveredCategory.budgetSortIndex && hoverClientY > hoverMiddleY) {
            return;
        }
        props.moveCategory(draggedCategory, hoveredCategory);
    }
};

interface DndP extends P {
    connectDropTarget?: (e: JSX.Element) => JSX.Element
    connectDragSource?: (e: JSX.Element) => JSX.Element
}

class _CategoryRow extends React.Component<DndP, {}> {
    rename = ({newName}) => {
        Meteor.call('budget.rename-category', this.props.category._id, newName);
    };

    render() {
        const {connectDragSource, connectDropTarget, category} = this.props;
        return connectDragSource(connectDropTarget(
            <tr className="category-row">
                <td className="category-name">
                    <RIEInput className="editable-category-name" value={category.name} propName="newName" change={this.rename}/>
                </td>
                <td><MoneyAmount amount={0}/></td>
                <td><MoneyAmount amount={0}/></td>
            </tr>
        ));
    }
}

export const CategoryRow = _.flow(
    DropTarget(DndTypes.CATEGORY_ROW, rowTarget, connect => ({ connectDropTarget: connect.dropTarget() })),
    DragSource(DndTypes.CATEGORY_ROW, rowSource, (connect, monitor) => ({ connectDragSource: connect.dragSource() }))
)(_CategoryRow);
