import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Position } from '../models/models';
import { ResizeService } from '../resize.service';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

export type ResizeDirection = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT';

export interface ResizeEvent {
  direction: ResizeDirection,
  startPoint: StartPoint
}

export interface StartPoint {
  startX: number,
  startY: number,
}

@Component({
  selector: 'lib-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2, private resizeService: ResizeService) {
    resizeService.currentResizingWidget$.subscribe(currentWidget => {
      // Remove absolute positioning
      const self = this.el.nativeElement;
      this.renderer.removeStyle(self, 'position');
      this.renderer.removeStyle(self, 'width')
      this.renderer.removeStyle(self, 'height')
      this.renderer.removeStyle(self, 'left')
      this.renderer.removeStyle(self, 'top')

      // Add grid positioning
      const overlayedPosition = currentWidget.properties.position;
      this.renderer.setStyle(self, 'grid-column-start', overlayedPosition.gridColStart);
      this.renderer.setStyle(self, 'grid-row-start', overlayedPosition.gridRowStart);
      this.renderer.setStyle(self, 'grid-column-end', overlayedPosition.gridColEnd);
      this.renderer.setStyle(self, 'grid-row-end', overlayedPosition.gridRowEnd);
    })

    this.resizeService.resizeDimensions$.subscribe((resizeDimensions) => {
      // Remove grid positioning and add absolute positioning
      const self = this.el.nativeElement;
      this.renderer.removeStyle(self, 'grid-area');
      this.renderer.setStyle(self, 'position', `absolute`); 
      this.renderer.setStyle(self, 'width', `${resizeDimensions.newWidth}px`);
      this.renderer.setStyle(self, 'height', `${resizeDimensions.newHeight}px`);
      this.renderer.setStyle(self, 'left', `${resizeDimensions.newLeft}px`);
      this.renderer.setStyle(self, 'top', `${resizeDimensions.newTop}px`);
    });
  }

  /**
   * on pointer down event, it call onResizeStartEvent to provide data to service.
   * @param event 
   * @param direction 
   */
  onPointerDown(event: PointerEvent, direction: ResizeDirection) {
    event.preventDefault();

    const resizeEvent = {
      direction: direction,
      startPoint: {
        startX: event.pageX,
        startY: event.pageY
      }
    } as ResizeEvent;

    this.resizeService.onResizeStartEvent(resizeEvent);
  }
}
