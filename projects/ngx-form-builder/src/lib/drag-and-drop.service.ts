import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {
  private readonly widgets: BehaviorSubject<Widget[]>;
  public widgets$: Observable<Widget[]>;
  public currentDraggedSize: BehaviorSubject<Size>;
  public currentDraggedId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.widgets = new BehaviorSubject<Widget[]>([]);
    this.widgets$ = this.widgets.asObservable();

    this.currentDraggedSize = new BehaviorSubject<Size>({
      minimalSize: {
        gridRowSpan: 1,
        gridColSpan: 1
      }
    } as Size);
  }

  /**
   * Needed method to store current dragged element information.
   * Due to the impossibility to access to Datatransfer data in dragenter event.
   * https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-store
   * @param size size data to calculate placeholder.
   */
  public onDragStart(id: string, size: Size) {
    this.currentDraggedSize.next(size);
    this.currentDraggedId.next(id)
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

  /**
   * Add given node to given reference element.
   * This method isn't currently Angular way to archieve the behavior. 
   * It should be rethink and deprecated in next version.
   * @param renderer renderer that could not be imported directly in service.
   * @param ref ElementRef in which add Node.
   * @param node Node to add to ElementRef
   */
  public AddContent(renderer: Renderer2, ref: ElementRef, node: Node) {
    const clone = node.cloneNode(true);
    clone.childNodes.forEach((node) => {
      renderer.appendChild(ref, node)
    })
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

  /**
   * Determines if a position is available on grid by checking if there is any collisions with existing widgets positions.
   * @param position new position.
   * @returns True if position is available on grid else false.
   */
  public isPositionAvailable(position: Position): boolean {
    for (let index = 0; index < this.widgets.value.length; index++) {
      if (this.widgets.value[index].id !== this.currentDraggedId.value && this.isAnyCollision(this.widgets.value[index].properties.position, position)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get all dropzones cells involved in a potential drop action.
   * @param renderer renderer that could not be imported directly in service.
   * @param currentElement current dropzone on which drop should be fired.
   * @returns HTMLElement array that represent full grid zone used on drop action.
   */
  public getCellsDropzones(renderer: Renderer2, currentElement: HTMLElement) {
    const parent = renderer.parentNode(currentElement);

    let cells: HTMLElement[] = [];
    for (let colIndex = 0; colIndex < this.currentDraggedSize.value.minimalSize.gridColSpan; colIndex++) {
      for (let rowIndex = 0; rowIndex < this.currentDraggedSize.value.minimalSize.gridRowSpan; rowIndex++) {
        const rowIdPart = (rowIndex + parseInt(currentElement.style.gridRowStart));
        const colIdPart = (colIndex + parseInt(currentElement.style.gridColumnStart));

        let currentCell = parent.querySelector("#cell-" + rowIdPart + '-' + colIdPart) as HTMLElement;

        if (currentCell) {
          cells.push(currentCell);
        }
      }
    }

    cells.push(currentElement);
    return cells;
  }

  /**
   * Calculate dragged element position on grid.
   * @param dropzone the dropzone element from which dragged should be droped. 
   * @returns dragged position.
   */
  public calculateDraggedPosition(gridRowStart: number, gridColStart: number) {
    return {
      gridRowStart: gridRowStart,
      gridRowEnd: gridRowStart + this.currentDraggedSize.value.minimalSize.gridRowSpan,
      gridColStart: gridColStart,
      gridColEnd: gridColStart + this.currentDraggedSize.value.minimalSize.gridColSpan,
      minimalSize: {
        gridRowSpan: this.currentDraggedSize.value.minimalSize.gridRowSpan,
        gridColSpan: this.currentDraggedSize.value.minimalSize.gridColSpan
      }
    };
  }
}

export interface Widget extends Properties {
  id: string,
  node: HTMLElement,
}

export interface Properties {
  properties: {
    position: Position
  }
}

export interface Size {
  minimalSize: {
    gridRowSpan: number,
    gridColSpan: number
  }
}

export interface Position extends Size {
  gridRowStart: number,
  gridRowEnd: number,
  gridColStart: number,
  gridColEnd: number
}