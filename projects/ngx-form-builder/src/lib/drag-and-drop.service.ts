import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Box } from './dnd-grid/models/grid.models';
import { Widget } from './drag-zone/drag-zone.component';

export enum DragType {
  create,
  move,
  resize
}

export interface DragSession {
  type: DragType;
  widget: Widget;
  widgetHandleOffsetCenterX: number;
  widgetHandleOffsetCenterY: number;
}

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {
  private readonly currentSession: Subject<DragSession>;
  public currentSession$: Observable<DragSession>;

  constructor() {
    this.currentSession = new Subject<DragSession>();
    this.currentSession$ = this.currentSession.asObservable();
  }

  public onDragStart(event: DragEvent, widget: Widget): void {
    const { offsetX, offsetY } = this.calculateOffsetFromWidgetCenter(event);

    this.currentSession.next(
      {
        type: DragType.create,
        widget,
        widgetHandleOffsetCenterX: offsetX,
        widgetHandleOffsetCenterY: offsetY
      } as DragSession
    );
  }

  public onDragEnd(event: DragEvent): void {
    //event.preventDefault();
    
  }

  /**
 * Calculate the offset the drag event
 * from the center of the element being dragged.
 * @param {DragEvent} event
 * @return {{ centerOffsetX: number, centerOffsetY: number }}
 */
  public calculateOffsetFromWidgetCenter(event: DragEvent): {
    offsetX: number;
    offsetY: number;
  } {
    const target = event.target as Element;
    const { left, top, width, height } = target.getBoundingClientRect();
    console.log({ left, top, width, height });
    return {
      offsetX: window.pageXOffset + left + width / 2 - event.pageX,
      offsetY: window.pageYOffset + top + height / 2 - event.pageY,
    };
  }
}
