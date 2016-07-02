// react-meteor-data
declare module "meteor/react-meteor-data" {
    import * as React from 'react';
    export function createContainer<P>(
        getReactiveData: () => P,
        render: (P) => any | typeof React.Component<P, {}>): any

    export function createContainer<PI, PO>(
        getReactiveData: (PI) => PO,
        render: ((PO) => any) | typeof React.Component<PO, {}>): any
}

// simple-schema, as seen on https://github.com/meteor-typescript/meteor-typescript-libs/blob/master/definitions/simple-schema.d.ts
declare var SimpleSchema: SimpleSchemaStatic;
interface SimpleSchemaDefinition {
    [attribute: string]: {[props: string]: any}
}
interface SimpleSchemaStatic {
    new(definition: SimpleSchemaDefinition): SimpleSchema;
    extendOptions(options: {[options: string]: any}): void;
}
interface SimpleSchema {
    validate(doc: any)
    clean(doc: any)
}

// collections2
declare module "meteor/collections2" {
    export interface Collection2<T> extends Mongo.Collection<T> {
        attachSchema(schema:SimpleSchema): void;
        attachJSONSchema(schema:any): void;
    }
}

// react-dnd-html5-backend
declare module 'react-dnd-html5-backend' {
    import * as React from 'react';
    export default class HTML5Backend<P> extends React.Component<P, {}> {}
}
