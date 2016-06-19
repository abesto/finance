import { Meteor } from 'meteor/meteor';
import * as _ from 'lodash';
import {throwUnlessAuthed} from "./auth";
import {Logger} from "./Logger";
import {MeteorMethodsUnsafe} from "./InsecureMethods";

Meteor.methods = function(methods: Object) {
    return MeteorMethodsUnsafe(_.mapValues(methods, (fn, name) => {
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

