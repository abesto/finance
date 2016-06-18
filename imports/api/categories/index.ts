import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {denyAllCollectionMethods} from "../../auth";

export interface SuperCategory {
    _id?: string
    name: string
    budgetSortIndex: number
}

export interface Category {
    _id?: string
    name: string
    superCategoryId: string
    budgetSortIndex: number
}

export const SuperCategoryCollection = new Mongo.Collection<SuperCategory>('supercategories');
denyAllCollectionMethods(SuperCategoryCollection);

export const CategoryCollection = new Mongo.Collection<Category>('categories');
denyAllCollectionMethods(CategoryCollection);

export function isCategory(item: Category | SuperCategory): item is Category {
    return 'superCategoryId' in item;
}
export function isSuperCategory(item: Category | SuperCategory): item is SuperCategory {
    return !isCategory(item);
}

Meteor.methods({
    'budget.move-category': (source: Category, target: Category) => {
        CategoryCollection.update(
            {
                budgetSortIndex: {$gt: source.budgetSortIndex},
                superCategoryId: source.superCategoryId
            },
            {$inc: {budgetSortIndex: -1}},
            {multi: true}
        );
        CategoryCollection.update(
            {
                budgetSortIndex: {$gte: target.budgetSortIndex},
                superCategoryId: target.superCategoryId
            },
            {$inc: {budgetSortIndex: 1}},
            {multi: true}
        );
        CategoryCollection.update(source._id, {$set: {
            superCategoryId: target.superCategoryId,
            budgetSortIndex: target.budgetSortIndex
        }});
    },

    'budget.move-super-category': (source: SuperCategory, target: SuperCategory) => {
        SuperCategoryCollection.update(
            {
                budgetSortIndex: {$gt: source.budgetSortIndex},
            },
            {$inc: {budgetSortIndex: -1}},
            {multi: true}
        );
        SuperCategoryCollection.update(
            {
                budgetSortIndex: {$gte: target.budgetSortIndex},
            },
            {$inc: {budgetSortIndex: 1}},
            {multi: true}
        );
        SuperCategoryCollection.update(source._id, {$set: {
            budgetSortIndex: target.budgetSortIndex
        }});
    },

    'budget.rename-category': (categoryId: number, newName: string) => CategoryCollection.update(
        categoryId, {$set: {name: newName}}
    ),

    'budget.rename-super-category': (superCategoryId: number, newName: string) => SuperCategoryCollection.update(
        superCategoryId, {$set: {name: newName}}
    ),
});
