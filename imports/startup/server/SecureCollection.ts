import { Mongo } from 'meteor/mongo';
import {denyAllCollectionMethods} from "./auth";

const original = Mongo.Collection;

class SecureCollection<T> extends Mongo.Collection<T> {
    constructor(name, options) {
        super(name, options);
        denyAllCollectionMethods(this);
    }
}

Mongo.Collection = SecureCollection;