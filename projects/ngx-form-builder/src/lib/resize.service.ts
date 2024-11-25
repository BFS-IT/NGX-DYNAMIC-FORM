import { ElementRef, Injectable } from '@angular/core';
import { Position, Size, Widget } from './models/models';
import { GridService } from './grid.service';
import { Observable, ReplaySubject } from 'rxjs';
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

  private readonly currentResizingWidget: ReplaySubject<Widget> = new ReplaySubject<Widget>(1);
  public currentResizingWidget$: Observable<Widget> = this.currentResizingWidget.asObservable();

  public readonly resizeDimensions: ReplaySubject<ResizeDimensions> = new ReplaySubject<ResizeDimensions>(1);
  public resizeDimensions$: Observable<ResizeDimensions> = this.resizeDimensions.asObservable();

  constructor(private readonly gridService: GridService) {
    this.resizeDimensions.subscribe((value) => {
      this.newDimension = value;
    });
  }

  /**
   * OnPointerUp event listener function to manage stop resizing on grid.
   * @param event PointerEvent emited by grid.
   */
  public onPointerUp = (event: PointerEvent) => {
    event.preventDefault();
    this.gridService.currentGrid.nativeElement.removeEventListener("pointermove", this.onPointerMove);
    this.gridService.currentGrid.nativeElement.removeEventListener("pointerup", this.onPointerUp);
    this.isResizing.next(false);
  }

  /**
 * OnPointerMove event to manage resizing of placeholder on grid.
 * @param event PointerEvent emited by grid.
 */
  private onPointerMove = (event: PointerEvent) => {
    event.preventDefault();
    this.handleResize(event.pageX, event.pageY);
  }

  /**
   * Called when placeholder start resizing on point down event.
   * @param resizeEvent ResizeEvent data.
   */
  public onResizeStartEvent(resizeEvent: ResizeEvent) {
    this.gridService.currentGrid.nativeElement.addEventListener("pointermove", this.onPointerMove);
    this.gridService.currentGrid.nativeElement.addEventListener("pointerup", this.onPointerUp);
    this.startPoint = resizeEvent.startPoint;
    this.direction = resizeEvent.direction;

    this.isResizing.next(true);
  }

  /**
   * Called by component that is currently resized to set current widget and his starting dimensions.
   * @param id Component id linked to a specific widget in stored widgets.
   * @param startDimensions Component starting dimensions.
   */
  public initializeWidgetResizing(id: string, startDimensions: StartDimensions) {
    this.startDimensions = startDimensions;
    const widget = this.gridService.getWidgetById(id);

    if (widget) {
      this.currentResizingWidget.next(widget);
    }
  }

  /**
   * Called by component that is currently resized to end his resizing.
   * It includes to remove pointer move listener on grid, update position of widget and set new current widget.
   * @param id Component id linked to a specific widget in stored widgets.
   */
  public endWidgetResizing(id: string) {
    this.updateWidgetPosition(id)
    const widget = this.gridService.getWidgetById(id);

    if (widget) {
      this.currentResizingWidget.next(widget);
    }
  }

  /**
   * Calcule and update current widget position and update current widget using grid service.
   * @param id Component id linked to a specific widget in stored widgets.
   */
  public updateWidgetPosition(id: string) {
    const newPositionProperties = this.calculateResizePosition(id);
    const newPosition = newPositionProperties.position;
    const newSize = newPositionProperties.size;

    if (this.gridService.isPositionAvailable(id, newPosition)) {
      this.gridService.updateWidgetPositionAndSize(id, newPosition, newSize);
    }
  }

  /**
   * Called by onPointerMove grid event to calculate and update redimensionned size on pointer move event.
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

  /**
   * Calculate and return an object containing position and size.
   * Not Typescript ideomatic way should be refactored.
   * @param id Component id linked to a specific widget in stored widgets. 
   * @returns {Position, Size} object
   */
  public calculateResizePosition(id: string): { position: Position, size: Size } {
    const wid = this.gridService.getWidgetById(id);

    let newPosition = {
      gridRowStart: wid!.properties.position.gridRowStart,
      gridRowEnd: wid!.properties.position.gridRowEnd,
      gridColStart: wid?.properties.position.gridColStart,
      gridColEnd: wid?.properties.position.gridColEnd,
    } as Position;

    let newSize = {
      current: wid?.properties.size.current,
      minimalSize: wid?.properties.size.minimalSize
    } as Size;

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

    return { position: newPosition, size: newSize };
  }
}
