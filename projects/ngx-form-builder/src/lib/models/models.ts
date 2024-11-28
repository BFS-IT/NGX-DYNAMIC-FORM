export interface Widget {
    id: string,
    node: HTMLElement,
    properties: Properties
}

export interface Properties {
    position: Position,
    size: Size,
    value: string,
    typeProperties: InputTypeProperties
}

export interface InputTypeProperties {
    required: boolean,
    placeholder: string,
    label: string
}

export interface Size {
    current: {
        gridRowSpan: number,
        gridColSpan: number
    },
    minimalSize: {
        gridRowSpan: number,
        gridColSpan: number
    }
}

export interface Position {
    gridRowStart: number,
    gridRowEnd: number,
    gridColStart: number,
    gridColEnd: number
}