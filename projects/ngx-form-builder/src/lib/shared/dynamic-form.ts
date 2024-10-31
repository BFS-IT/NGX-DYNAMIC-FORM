// To parse this data:
//
//   import { Convert, DynamicForm } from "./file";
//
//   const dynamicForm = Convert.toDynamicForm(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * Defines the structure that must have the JSON that defines a dynamic form for eSurvey
 */
export interface DynamicForm {
    /**
     * Composition of forms for different medias
     */
    forms: DynamicFormComposition[];
    /**
     * Form name that identify the form
     */
    name: string;
    [property: string]: any;
}

export interface DynamicFormComposition {
    /**
     * Enumerates all the components that the form should render
     */
    components: DynamicFormComponent[];
    /**
     * The type of media for responsive layout
     */
    media: Media;
    [property: string]: any;
}

export interface DynamicFormComponent {
    /**
     * Type of component
     */
    component?: Component;
    /**
     * The text content
     */
    text?: MultilingualString | string;
    /**
     * Style of text
     */
    textStyle?: TextStyle;
    /**
     * The unique ID of the component (handled by form builder)
     */
    id: string;
    /**
     * Define the position of component in the form
     */
    position: DynamicFormComponentPosition;
    /**
     * The type of input (correspond to <input type="">)
     */
    inputType?: InputType;
    /**
     * Text that represents witch value to enter
     */
    label?: MultilingualString | string;
    /**
     * The text shown in field to help user to know witch data to set
     */
    placeholder?: MultilingualString | string;
    /**
     * Array that contains all validators used to validate component entry
     */
    validators?: DynamicFormComponentValidator[];
    /**
     * The name of related variable, this will be used as the property name in JSON data result
     * of form entries
     */
    variable?: string;
    [property: string]: any;
}

/**
 * Type of component
 */
export enum Component {
    Input = "input",
    Text = "text",
}

/**
 * The type of input (correspond to <input type="">)
 */
export enum InputType {
    Integer = "integer",
    Number = "number",
    String = "string",
}

/**
 * The shown text as a multilingual text
 */
export interface MultilingualString {
    de?: string;
    en?: string;
    fr?: string;
    it?: string;
    [property: string]: any;
}

/**
 * Define the position of component in the form
 */
export interface DynamicFormComponentPosition {
    /**
     * Specify the column where the component is
     */
    col: number;
    /**
     * Specify the number of columns the component is over
     */
    colspan?: number;
    /**
     * Specify the row where the component is
     */
    row: number;
    /**
     * Specify the number of rows the component is over
     */
    rowspan?: number;
    [property: string]: any;
}

/**
 * Style of text
 */
export enum TextStyle {
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    H4 = "H4",
    H5 = "H5",
    H6 = "H6",
    Normal = "Normal",
}

/**
 * Defines all possible validators applicable to a field component
 */
export interface DynamicFormComponentValidator {
    required?:  DynamicFormValidatorBase;
    email?:     DynamicFormValidatorBase;
    pattern?:   DynamicFormValidatorValueStringBase;
    minLength?: DynamicFormValidatorValueIntegerBase;
    maxLength?: DynamicFormValidatorValueIntegerBase;
    min?:       DynamicFormValidatorValueNumberBase;
    max?:       DynamicFormValidatorValueNumberBase;
    [property: string]: any;
}

/**
 * Validator base definition
 */
export interface DynamicFormValidatorBase {
    /**
     * Error message shown if field is not valid
     */
    errorMessage?: MultilingualString | string;
    [property: string]: any;
}

/**
 * Validator number base definition
 *
 * Validator base definition
 */
export interface DynamicFormValidatorValueNumberBase {
    /**
     * Number that validator use to verify field data
     */
    value?: number;
    /**
     * Error message shown if field is not valid
     */
    errorMessage?: MultilingualString | string;
    [property: string]: any;
}

/**
 * Validator integer base definition
 *
 * Validator base definition
 */
export interface DynamicFormValidatorValueIntegerBase {
    /**
     * Integer that validator use to verify field data
     */
    value?: number;
    /**
     * Error message shown if field is not valid
     */
    errorMessage?: MultilingualString | string;
    [property: string]: any;
}

/**
 * Validator string base definition
 *
 * Validator base definition
 */
export interface DynamicFormValidatorValueStringBase {
    /**
     * String that validator use to verify field data
     */
    value?: string;
    /**
     * Error message shown if field is not valid
     */
    errorMessage?: MultilingualString | string;
    [property: string]: any;
}

/**
 * The type of media for responsive layout
 */
export enum Media {
    Large = "large",
    Medium = "medium",
    Small = "small",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDynamicForm(json: string): DynamicForm {
        return cast(JSON.parse(json), r("DynamicForm"));
    }

    public static dynamicFormToJson(value: DynamicForm): string {
        return JSON.stringify(uncast(value, r("DynamicForm")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "DynamicForm": o([
        { json: "forms", js: "forms", typ: a(r("DynamicFormComposition")) },
        { json: "name", js: "name", typ: "" },
    ], "any"),
    "DynamicFormComposition": o([
        { json: "components", js: "components", typ: a(r("DynamicFormComponent")) },
        { json: "media", js: "media", typ: r("Media") },
    ], "any"),
    "DynamicFormComponent": o([
        { json: "component", js: "component", typ: u(undefined, r("Component")) },
        { json: "text", js: "text", typ: u(undefined, u(r("MultilingualString"), "")) },
        { json: "textStyle", js: "textStyle", typ: u(undefined, r("TextStyle")) },
        { json: "id", js: "id", typ: "" },
        { json: "position", js: "position", typ: r("DynamicFormComponentPosition") },
        { json: "inputType", js: "inputType", typ: u(undefined, r("InputType")) },
        { json: "label", js: "label", typ: u(undefined, u(r("MultilingualString"), "")) },
        { json: "placeholder", js: "placeholder", typ: u(undefined, u(r("MultilingualString"), "")) },
        { json: "validators", js: "validators", typ: u(undefined, a(r("DynamicFormComponentValidator"))) },
        { json: "variable", js: "variable", typ: u(undefined, "") },
    ], "any"),
    "MultilingualString": o([
        { json: "de", js: "de", typ: u(undefined, "") },
        { json: "en", js: "en", typ: u(undefined, "") },
        { json: "fr", js: "fr", typ: u(undefined, "") },
        { json: "it", js: "it", typ: u(undefined, "") },
    ], "any"),
    "DynamicFormComponentPosition": o([
        { json: "col", js: "col", typ: 0 },
        { json: "colspan", js: "colspan", typ: u(undefined, 0) },
        { json: "row", js: "row", typ: 0 },
        { json: "rowspan", js: "rowspan", typ: u(undefined, 0) },
    ], "any"),
    "DynamicFormComponentValidator": o([
        { json: "required", js: "required", typ: u(undefined, r("DynamicFormValidatorBase")) },
        { json: "email", js: "email", typ: u(undefined, r("DynamicFormValidatorBase")) },
        { json: "pattern", js: "pattern", typ: u(undefined, r("DynamicFormValidatorValueStringBase")) },
        { json: "minLength", js: "minLength", typ: u(undefined, r("DynamicFormValidatorValueIntegerBase")) },
        { json: "maxLength", js: "maxLength", typ: u(undefined, r("DynamicFormValidatorValueIntegerBase")) },
        { json: "min", js: "min", typ: u(undefined, r("DynamicFormValidatorValueNumberBase")) },
        { json: "max", js: "max", typ: u(undefined, r("DynamicFormValidatorValueNumberBase")) },
    ], "any"),
    "DynamicFormValidatorBase": o([
        { json: "errorMessage", js: "errorMessage", typ: u(undefined, u(r("MultilingualString"), "")) },
    ], "any"),
    "DynamicFormValidatorValueNumberBase": o([
        { json: "value", js: "value", typ: u(undefined, 3.14) },
        { json: "errorMessage", js: "errorMessage", typ: u(undefined, u(r("MultilingualString"), "")) },
    ], "any"),
    "DynamicFormValidatorValueIntegerBase": o([
        { json: "value", js: "value", typ: u(undefined, 0) },
        { json: "errorMessage", js: "errorMessage", typ: u(undefined, u(r("MultilingualString"), "")) },
    ], "any"),
    "DynamicFormValidatorValueStringBase": o([
        { json: "value", js: "value", typ: u(undefined, "") },
        { json: "errorMessage", js: "errorMessage", typ: u(undefined, u(r("MultilingualString"), "")) },
    ], "any"),
    "Component": [
        "input",
        "text",
    ],
    "InputType": [
        "integer",
        "number",
        "string",
    ],
    "TextStyle": [
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "Normal",
    ],
    "Media": [
        "large",
        "medium",
        "small",
    ],
};
