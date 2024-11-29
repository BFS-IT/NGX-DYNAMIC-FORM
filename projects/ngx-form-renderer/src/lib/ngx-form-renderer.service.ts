import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxFormRendererService {

  constructor() { }
}


/**
 * Widget supported types.
 */
export type WidgetType = 'input' | 'radio' | 'custom';

/**
* Widget interface used for all widget.
*/
export interface Widget<T extends WidgetType> {
  id: string,
  node: HTMLElement,
  properties: Properties<T>
}

/**
* Properties of a widget.
*/
export interface Properties<T extends WidgetType> {
  position: Position,
  size: Size,
  typeProperties: TypeProperties<T>
}

/**
* Grid based position property of a widget.
*/
export interface Position {
  gridRowStart: number,
  gridRowEnd: number,
  gridColStart: number,
  gridColEnd: number
}

/**
* Grid based size property of a widget.
*/
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

/**
* Generic type properties to manage widget render type.
*/
type TypeProperties<T extends WidgetType> =
  T extends 'input' ? InputProperties :
  T extends 'radio' ? RadioGroupProperties :
  'custom';

/**
* Commons properties of a widget no matter his render type.
*/
export interface CommonsProperties {
  name: string,
  readonly?: boolean,
  required?: boolean,
}

/**
 * An Input could have type :
 * color
 * date
 * datetime-local
 * email
 * month
 * number
 * password
 * search
 * tel
 * text
 * time
 * url
 * week
 * https://material.angular.io/components/input/overview
 */
type InputType = 'text' | 'email' | 'date';

/**
* Material Input properties.
*/
export interface InputProperties extends CommonsProperties {
  type: InputType,
  label?: string,
  placeholder?: string,
  hint?: string
}

/**
* Material Radio group properties.
* https://material.angular.io/components/radio/overview
*/
export interface RadioGroupProperties {
  name: string,
  label: string,
  labelPosition: 'before' | 'after',
  radioButtons: RadioButtonProperties[]
}

/**
* Material Radio button properties.
* https://material.angular.io/components/radio/overview
*/
export interface RadioButtonProperties {
  label: string,
  value: string,
  checked?: boolean
}