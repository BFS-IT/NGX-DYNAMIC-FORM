import { ElementRef, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Position, Size, Widget } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  public currentGrid!: ElementRef;
  // Max span is number of row/col + 1
  private readonly GRID_ROW_MAX_SPAN = 13;
  private readonly GRID_COL_MAX_SPAN = 13;

  public readonly widgets: BehaviorSubject<Widget[]>;
  public widgets$: Observable<Widget[]>;

  constructor() {
    this.widgets = new BehaviorSubject<Widget[]>([]);
    this.widgets$ = this.widgets.asObservable();
  }

  /**
   * get widget by id.
   * @param id Component linked id.
   * @returns Widget if it exists else undefined.
   */
  getWidgetById(id: string): Widget | undefined {
    return this.widgets.value.find((widget) => widget.id === id);
  }

  /**
   * Update widget position in grid widgets subject.
   * @param id Component linked id.
   * @param newPosition New position of widget.
   */
  updateWidgetPosition(id: string, newPosition: Position) {
    const currentValue = this.widgets.value;
    const updatedValue = [...currentValue];

    for (let widget of currentValue) {
      if (widget.id === id) {
        widget.properties.position = newPosition;
        break;
      }
    }
    
    this.widgets.next(updatedValue);
  }

  /**
   * Update wudget position and size in grid widgets subject.
   * @param id Component linked id.
   * @param newPosition New position of widget.
   * @param newSize New size of widget.
   */
  updateWidgetPositionAndSize(id: string, newPosition: Position, newSize: Size) {
    const currentValue = this.widgets.value;
    const updatedValue = [...currentValue];
    
    for (let widget of currentValue) {
      if (widget.id === id) {
        widget.properties.position = newPosition;
        widget.properties.size = newSize;
        break;
      }
    }
    
    this.widgets.next(updatedValue);
  }

  /**
   * Add a widget to widgets subject.
   * @param newWidget New widget to add.
   */
  addWidget(newWidget: Widget) {
    const currentValue = this.widgets.value;
    const updatedValue = [...currentValue, newWidget];
    this.widgets.next(updatedValue);
  }

  /**
 * Determines if a position is available on grid by checking if there is any collisions with existing widgets positions.
 * @param id widget id to avoid collision on self.
 * @param position new position.
 * @returns True if position is available on grid else false.
 */
  public isPositionAvailable(id: string, position: Position): boolean {
    if (position.gridColStart < 0 ||
        position.gridRowStart < 0 ||
        position.gridColEnd > this.GRID_COL_MAX_SPAN ||
        position.gridRowEnd > this.GRID_ROW_MAX_SPAN) {
      return false;
    }

    let currentWidget: Widget;
    for (let index = 0; index < this.widgets.value.length; index++) {
      currentWidget = this.widgets.value[index];
      if (currentWidget.id !== id && this.isAnyCollision(currentWidget.properties.position, position)) {
        return false;
      }
    }

    return true;
  }

  /**
* Determines if a new position has any collision with an existing one.
* @param existingPosition existing position.
* @param newPosition new position.
* @returns true if any collisions on rows or columns else false.
*/
  private isAnyCollision(existingPosition: Position, newPosition: Position): boolean {
    const horizontalOverlap = newPosition.gridColStart < existingPosition.gridColEnd &&
      newPosition.gridColEnd > existingPosition.gridColStart;

    const verticalOverlap = newPosition.gridRowStart < existingPosition.gridRowEnd &&
      newPosition.gridRowEnd > existingPosition.gridRowStart;

    return horizontalOverlap && verticalOverlap;
  }
}
