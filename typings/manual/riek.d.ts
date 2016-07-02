declare module "riek" {
    import * as React from 'react';

    interface P {
        value: string
        propName?: string
        change?: (any) => any
        className?: string
        validate?: (s: string) => boolean
    }

    interface S {
        loading: boolean
    }

    export class RIEInput<EP> extends React.Component<EP & P, S> {
        makeClassString(): string
        textChanged(e): void
        finishEditing(e): void
        keyDown(e): void
        renderEditingComponent: () => JSX.Element
    }
}

