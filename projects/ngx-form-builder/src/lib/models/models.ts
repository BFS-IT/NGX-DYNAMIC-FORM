export interface Widget {
    id: string,
    node: HTMLElement,
    properties: Properties
}

export interface Properties {
    position: Position,
    size: Size,
    value: string
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