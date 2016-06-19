import { Mongo } from 'meteor/mongo';
import {denyAllCollectionMethods} from "./auth";

export const UnsafeMongoCollection = Mongo.Collection;

var __extends = this.__extends || function (d, b) {
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };

const SafeMongoCollection = (function () {
    __extends(SafeMongoCollection, UnsafeMongoCollection);
    function SafeMongoCollection() {
        UnsafeMongoCollection.apply(this, arguments);
        denyAllCollectionMethods(this);
    }
    return SafeMongoCollection;
})();

Mongo.Collection = SafeMongoCollection as any as Mongo.CollectionStatic;