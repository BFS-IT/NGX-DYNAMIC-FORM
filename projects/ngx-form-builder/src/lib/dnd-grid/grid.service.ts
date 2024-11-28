import { ElementRef, Injectable, Signal } from '@angular/core';
import { Position, Widget } from '../models/models';
import { Cell } from './models/grid.models';
import { StateService } from '../state.service';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  public currentGrid!: ElementRef;

  // Max span is number of row/col + 1
  private readonly GRID_ROW_MAX_SPAN = 13;
  private readonly GRID_COL_MAX_SPAN = 13;

  public readonly widgets: Signal<Widget[]>;

  constructor(private readonly stateService: StateService) {
    this.widgets = this.stateService.widgets.asReadonly();
  }

  changeSelected(id: string) {
    this.stateService.setCurrentSelectedWidget(id);
  }

  /**
   * get widget by id.
   * @param id Component linked id.
   * @returns Widget if it exists else undefined.
   */
  getWidgetById(id: string): Widget | undefined {
    return this.stateService.getWidgetById(id);
  }

  /**
  * Generate the cells for the given grid size.
  * 
  * @return {Cell[]}
  */
  public generateGrid(rowCount: number, colCount: number): Cell[] {
    const grid: Cell[] = [];
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const cell = { rowPosition: row + 1, colPosition: col + 1 } as Cell;
        grid.push(cell);
      }
    }
    return grid;
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
    for (let index = 0; index < this.widgets().length; index++) {
      currentWidget = this.widgets()[index];
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