import { Meteor } from 'meteor/meteor';
import * as _ from 'lodash';
import {throwUnlessAuthed, getEmail} from "./auth";
import {Logger} from "./Logger";

Meteor.methods = function(methods: Object) {
    return Meteor.methodsUnsafe(_.mapValues(methods, (fn, name) => {
        return function() {
            var action = {type: 'method', arguments: Array.prototype.slice.call(arguments), methodName: name};

            throwUnlessAuthed(this, action);
            const retval = fn.apply(this, arguments);

            action["retval"] = retval;
            Logger.info(this, action);

            return retval;
        };
    }));
};

