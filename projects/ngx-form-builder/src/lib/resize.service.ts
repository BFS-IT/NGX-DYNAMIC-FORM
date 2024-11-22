import { ElementRef, Injectable } from '@angular/core';
import { DragAndDropService, Position, Size, Widget } from './drag-and-drop.service';
import { GridService } from './grid.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ResizeDirection, ResizeEvent, StartPoint } from './placeholder/placeholder.component';

export interface ResizeDimensions {
  newWidth: number;
  newHeight: number;
  newLeft: number;
  newTop: number;
}

export interface StartDimensions {
  offsetWidth: number,
  offsetHeight: number,
  offsetTop: number,
  offsetLeft: number
}

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private startDimensions!: StartDimensions;
  private startPoint!: StartPoint;
  private direction!: ResizeDirection;
  private newDimension!: ResizeDimensions;

  private readonly isResizing: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isResizing$ = this.isResizing.asObservable();

  public readonly currentResizingWidget: ReplaySubject<Widget> = new ReplaySubject<Widget>(1);
  public currentResizingWidget$: Observable<Widget> = this.currentResizingWidget.asObservable();

  public readonly resizeDimensions: ReplaySubject<ResizeDimensions> = new ReplaySubject<ResizeDimensions>(1);
  public resizeDimensions$: Observable<ResizeDimensions> = this.resizeDimensions.asObservable();

  constructor(private readonly gridService: GridService) { 
    this.resizeDimensions.subscribe((value) => {
      this.newDimension = value;
    });
  }

  /**
   * Called when placeholder start resizing on point down event.
   * @param resizeEvent ResizeEvent data.
   */
  public onResizeStartEvent(resizeEvent: ResizeEvent) {
    this.startPoint = resizeEvent.startPoint;
    this.direction = resizeEvent.direction;
    this.gridService.currentGrid.nativeElement.addEventListener('pointermove', this.onPointerMove);
    this.gridService.currentGrid.nativeElement.addEventListener('pointerup', (event: PointerEvent) => {
      const childElement = document.getElementById('child')
    });
    this.isResizing.next(true);
  }

  /**
   * Called when placehoder end resizing on pointer up event.
   */
  public onResizeEndEvent() {
    this.gridService.currentGrid.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.isResizing.next(false);
  }

  /**
   * Called by component that is currently resized to set current widget, his starting dimensions and his onPointerMove event.
   * @param id Component id linked to a specific widget in stored widgets.
   * @param startDimensions Component starting dimensions.
   * @param onPointerMove DOM event to add to grid listeners.
   */
  public initializeWidgetResizing(id: string, startDimensions: StartDimensions) {
    this.startDimensions = startDimensions;
    const widget = this.gridService.getWidgetById(id);

    if (widget) {
      this.currentResizingWidget.next(widget);
    }
  }

  private onPointerMove = (event: PointerEvent) => {
    this.handleResize(event.pageX, event.pageY);
    event.preventDefault();
  }

  /**
   * Called by component that is currently resized to end his resizing.
   * It includes to remove pointer move listener on grid, update position of widget and set new current widget.
   * @param id Component id linked to a specific widget in stored widgets.
   * @param onPointerMove DOM event to remove from grid listeners.
   */
  public endWidgetResizing(id: string) {

    this.updateWidgetPosition(id,)

    const widget = this.gridService.getWidgetById(id);

    if (widget) {
      this.currentResizingWidget.next(widget);
    }
  }

  /**
   * Calcule and update current widget position and update current widget using grid service.
   * @param id 
   */
  public updateWidgetPosition(id: string) {
    const newPosition = this.calculateNewPosition(id);

    if (this.gridService.isPositionAvailable(id, newPosition)) {
      this.gridService.updateWidgetPosition(id, newPosition);
    }
  }

  /**
   * Called by component to calculate and update redimensionned size on pointer move event.
   * @param currentX Current pointer X position.
   * @param currentY Current pointer Y position.
   */
  handleResize(currentX: number, currentY: number) {
    let newWidth = this.startDimensions.offsetWidth;
    let newHeight = this.startDimensions.offsetHeight;
    let newLeft = this.startDimensions.offsetLeft;
    let newTop = this.startDimensions.offsetTop;

    let deltaX = currentX - this.startPoint.startX;
    let deltaY = currentY - this.startPoint.startY;

    switch (this.direction) {
      case 'RIGHT':
        newWidth = this.startDimensions.offsetWidth + deltaX;
        break;
      case 'DOWN':
        newHeight = this.startDimensions.offsetHeight + deltaY;
        break;
      case 'LEFT':
        newWidth = this.startDimensions.offsetWidth - deltaX;
        newLeft = this.startDimensions.offsetLeft + deltaX;
        break;
      case 'UP':
        newHeight = this.startDimensions.offsetHeight - deltaY;
        newTop = this.startDimensions.offsetTop + deltaY;
        break;
    }

    const resizeDimensions: ResizeDimensions = {
      newWidth,
      newHeight,
      newLeft,
      newTop,
    };

    this.resizeDimensions.next(resizeDimensions);
  }

  public calculateNewPosition(id: string): Position {
    const wid = this.gridService.getWidgetById(id);

    const newPosition = {
      gridRowStart: wid!.properties.position.gridRowStart,
      gridRowEnd: wid!.properties.position.gridRowEnd,
      gridColStart: wid?.properties.position.gridColStart,
      gridColEnd: wid?.properties.position.gridColEnd,
    } as Position;

    const newSize = { ...wid?.properties.size } as Size;

    const gridCellWidth = this.startDimensions.offsetWidth / newSize.minimalSize.gridColSpan;
    const gridCellHeight = this.startDimensions.offsetHeight / newSize.minimalSize.gridRowSpan;

    let rowSpanToAdd = Math.ceil(this.newDimension.newHeight / gridCellHeight) - newSize.current.gridRowSpan;
    let colSpanToAdd = Math.ceil(this.newDimension.newWidth / gridCellWidth) - newSize.current.gridColSpan;

    if (this.direction === 'UP') {
      newPosition.gridRowStart -= rowSpanToAdd;
      newSize.current.gridRowSpan += rowSpanToAdd;
    }
    else if (this.direction === 'DOWN') {
      newPosition.gridRowEnd += rowSpanToAdd;
      newSize.current.gridRowSpan += rowSpanToAdd;
    }
    else if (this.direction === 'LEFT') {
      newPosition.gridColStart -= colSpanToAdd;
      newSize.current.gridColSpan += colSpanToAdd;
    }
    else {
      newPosition.gridColEnd += colSpanToAdd;
      newSize.current.gridColSpan += colSpanToAdd;
    }

    return newPosition;
  }
}
