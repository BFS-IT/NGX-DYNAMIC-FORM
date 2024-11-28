import { Injectable, signal } from '@angular/core';
import { Position, Properties, Size, Widget } from './models/models';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public widgets = signal<Widget[]>([]);
  private currentSelectedWidget: ReplaySubject<Widget> = new ReplaySubject(1);
  public currentSelectedWidget$: Observable<Widget> = this.currentSelectedWidget.asObservable();

  constructor() { }

  setCurrentSelectedWidget(id: string) {
    const widget = this.getWidgetById(id);
    
    if (widget) {
      this.currentSelectedWidget.next(widget);
      console.log(this.currentSelectedWidget)
    }
    else {
      throw Error("Widget with id not found in state.", { cause: "Undefined widget on setting current selected widget." })
    }
  }

  /**
  * Add a widget by updating widget signal.
  * Id is automaticly generated as widget-RANDOMUUID.
  * @param newWidget New widget to add.
  */
  public addWidget(node: HTMLElement, properties: Properties) {
    const newWidget = {
      id: 'widget-' + crypto.randomUUID(),
      node: node,
      properties: properties
    } as Widget;

    this.widgets.update(current => [...current, newWidget]);
  }

  /**
  * Remove a widget from widgets by updated new signal without removed widget.
  * @param id Widget id to remove.
  */
  public removeWidget(id: string) {
    this.widgets.update((widgets) => widgets.filter(widget => widget.id !== id));
  }

  /**
  * get widget by id from signal.
  * @param id Component linked id.
  * @returns Widget if it exists else undefined.
  */
  public getWidgetById(id: string): Widget | undefined {
    return this.widgets().find((widget) => widget.id === id);
  }

  /**
  * Update widget position by updating signal.
  * @param id Component linked id.
  * @param newPosition New position of widget.
  */
  public updateWidgetPosition(id: string, newPosition: Position) {
    this.widgets.update(widgets => widgets.map(widget =>
      widget.id === id ? { ...widget, properties: { ...widget.properties, position: newPosition } } : widget
    ));
  }

  /**
   * Update widget size by updating signal.
   * @param id 
   * @param newSize 
   */
  public updateWidgetSize(id: string, newSize: Size) {
    this.widgets.update(widgets => widgets.map(
      widget => widget.id === id ? { ...widget, properties: { ...widget.properties, size: newSize } } : widget
    ));
  }

  /**
   * Update widget position and size by updating signal.
   * @param id Component linked id.
   * @param newPosition New position of widget.
   * @param newSize New size of widget.
   */
  public updateWidgetPositionAndSize(id: string, newPosition: Position, newSize: Size) {
    this.updateWidgetPosition(id, newPosition);
    this.updateWidgetSize(id, newSize);
  }
}
