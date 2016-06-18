import { Meteor } from 'meteor/meteor';

import {CategoryCollection, SuperCategoryCollection} from "../index.ts";

Meteor.publish('categories', () => CategoryCollection.find({}));
Meteor.publish('supercategories', () => SuperCategoryCollection.find({}));
