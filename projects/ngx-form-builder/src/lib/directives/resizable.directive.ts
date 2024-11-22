import { Directive, ElementRef, Renderer2, HostListener, AfterContentInit, Output, Input, EventEmitter, ViewContainerRef, ComponentRef } from '@angular/core';
import { DragAndDropService, Position, Size, Widget } from '../drag-and-drop.service';
import { GridService } from '../grid.service';
import { ResizeService, StartDimensions } from '../resize.service';
import { PlaceholderComponent, ResizeDirection, ResizeEvent } from '../placeholder/placeholder.component';

@Directive({
  selector: '[nfbResizable]',
  standalone: true
})
export class ResizableDirective implements AfterContentInit {
  private placeholder!: ComponentRef<PlaceholderComponent>;
  private host!: HTMLElement;

  constructor(private el: ElementRef,
    private readonly vcr: ViewContainerRef,
    private readonly resizeService: ResizeService) {
      this.placeholder = this.vcr.createComponent(PlaceholderComponent);
  }

  ngAfterContentInit(): void {
    this.host = this.el.nativeElement as HTMLElement;
    // Should be called at least once.
    this.onResizeStart(this.host.id, {
      offsetWidth: this.host.offsetWidth,
      offsetHeight: this.host.offsetHeight,
      offsetLeft: this.host.offsetLeft,
      offsetTop: this.host.offsetTop
    } );

    this.resizeService.isResizing$.subscribe((isResising) => {
      const startDimensions = {
        offsetWidth: this.host.offsetWidth,
        offsetHeight: this.host.offsetHeight,
        offsetLeft: this.host.offsetLeft,
        offsetTop: this.host.offsetTop
      } as StartDimensions;
      
      isResising ? this.onResizeStart(this.host.id, startDimensions) : this.onResizeEnd(this.host.id);
    });
  }

  private onResizeStart(id: string, startDimensions: StartDimensions) {
    this.resizeService.initializeWidgetResizing(id, startDimensions);
  }
  
  private onResizeEnd(id: string) {
    this.resizeService.endWidgetResizing(id);
    this.vcr.remove();
  }
}
