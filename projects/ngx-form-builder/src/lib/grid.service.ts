import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Position, Widget } from './drag-and-drop.service';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  public readonly widgets: BehaviorSubject<Widget[]>;
  public widgets$: Observable<Widget[]>;

  constructor() {
    this.widgets = new BehaviorSubject<Widget[]>([]);
    this.widgets$ = this.widgets.asObservable();
  }

  updateWidgetPosition(id: string, newPosition: Position) {
    const currentValue = this.widgets.value;
    const updatedValue = [...currentValue];
    

    for (let widget of currentValue) {
      if (widget.id === id) {
        widget.properties.position = newPosition;
        return;
      }
    }

    this.widgets.next(updatedValue);
  }

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
