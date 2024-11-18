import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GridService } from './grid.service';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {
  public currentDraggedSize: BehaviorSubject<Size>;
  public currentDraggedId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly gridService: GridService) {
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
    this.gridService.updateWidgetPosition(id, position);
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

    this.gridService.addWidget(newWidget);
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