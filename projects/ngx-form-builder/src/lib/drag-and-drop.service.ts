import { ElementRef, Injectable, Renderer2} from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';

export interface Position {
  gridRowStart: number,
  gridRowEnd: number,
  gridColStart: number,
  gridColEnd: number
}

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
  private readonly widgets: BehaviorSubject<Widget[]>;
  public widgets$: Observable<Widget[]>;

  constructor() {
    this.widgets = new BehaviorSubject<Widget[]>([]);
    this.widgets$ = this.widgets.asObservable();
  }

  /**
   * Move widget wrapper using it's id.
   * @param id widget wrapper id.
   * @param position new position on the grid.
   */
  public onMoveDrop(id: string, position: Position) {
    const currentValue = this.widgets.value;
    const updatedValue = [...currentValue];

    for (let widget of currentValue) {
      if (widget.id === id) {
        widget.properties.position = position;
        return;
      }
    }

    this.widgets.next(updatedValue);
  }

  /**
   * Add a new widget wrapper at the divent position.
   * @param position new position on the grid.
   */
  public onAddDrop(id: string, position: Position) {
    const wrapperNode = document.getElementById(id) as HTMLElement;

    const newWidget = {
      id: 'widget-' + crypto.randomUUID(),
      node: wrapperNode,
      properties: {
        position: position
      }
    } as Widget;

    const currentValue = this.widgets.value;
    const updatedValue = [...currentValue, newWidget];
    this.widgets.next(updatedValue);
  }

  public AddContent(renderer: Renderer2, ref: ElementRef, node: Node) {
    const clone = node.cloneNode(true);
    clone.childNodes.forEach((node) => {
      renderer.appendChild(ref, node)
    })
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

    return {
      offsetX: window.pageXOffset + left + width / 2 - event.pageX,
      offsetY: window.pageYOffset + top + height / 2 - event.pageY,
    };
  }
}

export interface Widget {
  id: string,
  node: HTMLElement,
  properties: {
    position: {
      gridRowStart: number,
      gridColStart: number,
      gridRowEnd: number,
      gridColEnd: number
    }
  }
}