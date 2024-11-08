export interface Point {
    rowPosition: number;
    colPosition: number;
}

export interface Box extends Point {
    rowSpan: number;
    colSpan: number;
}

export interface Cell extends Point {
    isHighlighted: boolean;
}