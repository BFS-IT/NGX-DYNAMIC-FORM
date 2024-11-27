import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Position, Properties, Size, Widget } from './models/models';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {
  public currentDraggedSize: BehaviorSubject<Size>;
  public currentDraggedId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly gridService: StateService) {
    this.currentDraggedSize = new BehaviorSubject<Size>({
      minimalSize: {
        gridRowSpan: 1,
        gridColSpan: 1
      },
      current: {
        gridColSpan: 1,
        gridRowSpan: 1
      }
    } as Size);
  }

  /**
   * Needed method to store current dragged element information.
   * Due to the impossibility to access to Datatransfer data in dragenter event.
   * https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-store
   * @param id item id that start a drag.
   * @param gridRowSpan row span of the current element.
   * @param gridColSpan col span of the current element.
   */
  public onDragStart(id: string, gridRowSpan: number, gridColSpan: number) {
    const minimalSize = { gridRowSpan: gridRowSpan, gridColSpan: gridColSpan };

    // As long as we don't know at this moment if we are moving or copying an element. Should be refactored.
    const widget: Widget | undefined = this.gridService.getWidgetById(id);
    const currentSize: Size = widget ?
      widget?.properties.size :
      {
        minimalSize: minimalSize,
        current: minimalSize
      };

    this.currentDraggedId.next(id);
    this.currentDraggedSize.next(currentSize);
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

    const widgetProperties = {
      position: position,
      size: this.currentDraggedSize.value
    } as Properties;

    this.gridService.addWidget(wrapperNode, widgetProperties);
  }

  /**
   * Add given node to given reference element.
   * This method isn't currently Angular way to archieve the behavior. 
   * It should be rethink and deprecated in next version.
   * @param renderer renderer that could not be imported directly in service.
   * @param ref ElementRef in which add Node.
   * @param node Node to add to ElementRef
   */
  public addContent(renderer: Renderer2, ref: ElementRef, node: Node) {
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
    for (let colIndex = 0; colIndex < this.currentDraggedSize.value.current.gridColSpan; colIndex++) {
      for (let rowIndex = 0; rowIndex < this.currentDraggedSize.value.current.gridRowSpan; rowIndex++) {
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
    } as Position;
  }
}