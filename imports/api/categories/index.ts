import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Collection2 } from 'meteor/collections2';

export var CategorySchemas: {[key: string]: SimpleSchema} = {};

export interface SuperCategory {
    _id?: string
    name: string
    budgetSortIndex: number
}
CategorySchemas["SuperCategory"] = new SimpleSchema({
    name: {type: String},
    budgetSortIndex: {type: Number}
});

export interface Category {
    _id?: string
    name: string
    superCategoryId: string
    budgetSortIndex: number
}
CategorySchemas["Category"] = new SimpleSchema({
    name: {type: String},
    superCategoryId: {type: String},
    budgetSortIndex: {type: Number}
});

export const SuperCategoryCollection = new Mongo.Collection<SuperCategory>('supercategories') as Collection2<SuperCategory>;
SuperCategoryCollection.attachSchema(CategorySchemas["SuperCategory"]);

export const CategoryCollection = new Mongo.Collection<Category>('categories') as Collection2<Category>;
CategoryCollection.attachSchema(CategorySchemas["Category"]);

export function isCategory(item: Category | SuperCategory): item is Category {
    return 'superCategoryId' in item;
}
export function isSuperCategory(item: Category | SuperCategory): item is SuperCategory {
    return !isCategory(item);
}

function categoryBudgetSortIndexForBottom(superCategoryId) {
    const lastNewSiblingCategory = CategoryCollection.findOne({superCategoryId: superCategoryId}, {sort: {budgetSortIndex: -1}});
    if (lastNewSiblingCategory == null) {
        return 0;
    }
    return lastNewSiblingCategory.budgetSortIndex + 1;
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
        return CategoryCollection.update(category._id, {$set: {
            superCategoryId: superCategory._id,
            budgetSortIndex: categoryBudgetSortIndexForBottom(superCategory._id)
        }});
    },

    'budget.create-super-category': (name: string) => {
        // using sorted findOne for max selection is inefficient, but clean, and number of categories won't go high anyway
        const lastSuperCategory = SuperCategoryCollection.findOne({}, {sort: {budgetSortIndex: -1}});
        return SuperCategoryCollection.insert({
            name: name,
            budgetSortIndex: lastSuperCategory ? lastSuperCategory.budgetSortIndex + 1 : 0
        });
    },

    'budget.create-category': (superCategoryId: string, name: string) => {
        if (SuperCategoryCollection.findOne(superCategoryId) == null) {
            throw new Meteor.Error("Category group with ID " + superCategoryId + " doesn't exist");
        }
        return CategoryCollection.insert({
            name: name,
            superCategoryId: superCategoryId,
            budgetSortIndex: categoryBudgetSortIndexForBottom(superCategoryId)
        })
    }
});
