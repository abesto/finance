import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

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
export const CategoryCollection = new Mongo.Collection<Category>('categories');

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

    'budget.move-to-top': (category: Category, superCategory: SuperCategory) => {
        const firstNewSiblingCategory = CategoryCollection.findOne({superCategoryId: superCategory._id}, {sort: {budgetSortIndex: 1}});
        if (firstNewSiblingCategory == null) {
            return CategoryCollection.update(category._id, {$set: {superCategoryId: superCategory._id, budgetSortIndex: 0}});
        } else {
            return Meteor.call('budget.move-category', category, firstNewSiblingCategory);
        }
    },

    'budget.move-to-bottom': (category: Category, superCategory: SuperCategory) => {
        const lastNewSiblingCategory = CategoryCollection.findOne({superCategoryId: superCategory._id}, {sort: {budgetSortIndex: -1}});
        if (lastNewSiblingCategory == null) {
            return CategoryCollection.update(category._id, {$set: {superCategoryId: superCategory._id, budgetSortIndex: 0}});
        } else {
            return CategoryCollection.update(category._id, {$set: {superCategoryId: superCategory._id, budgetSortIndex: lastNewSiblingCategory.budgetSortIndex + 1}});
        }
    },

    'budget.create-super-category': (name: string) => {
        // using sorted findOne for max selection is inefficient, but clean, and number of categories won't go high anyway
        const lastSuperCategory = SuperCategoryCollection.findOne({}, {sort: {budgetSortIndex: -1}});
        return SuperCategoryCollection.insert({
            name: name,
            budgetSortIndex: lastSuperCategory ? lastSuperCategory.budgetSortIndex + 1 : 0
        });
    }
});
