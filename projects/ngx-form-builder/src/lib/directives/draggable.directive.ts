import { Directive, HostListener, Input, HostBinding, Renderer2, ElementRef } from '@angular/core';
import { DragAndDropService, Position, Size } from '../drag-and-drop.service';
import { GridService } from '../grid.service';

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
export type EffectAllowed = 'move' | 'copy' | 'link' | 'none' | 'copyMove' | 'copyLink' | 'linkMove' | 'all' | "uninitialized";

@Directive({
  selector: '[ndfDrag]',
  standalone: true
})
export class DraggableDirective {
  @Input('effectAllowed') effectAllowed: EffectAllowed = 'copy';
  @Input('rowSpan') rowSpan: number = 1;
  @Input('colSpan') colSpan: number = 1;

  @HostBinding('attr.draggable') draggable = true;
  @HostBinding('class') classes = 'draggable';

  @HostListener('dragstart', ['$event'])
  onDragStartEvent(event: DragEvent) {
    // actually we have to get parent when moving because of html structure of components
    const id: string = this.effectAllowed === 'move' ?
      (this.renderer.parentNode(this.renderer.parentNode(this.el.nativeElement)) as HTMLElement).id :
      (event.currentTarget as HTMLElement).id;

    // Store current dragged element in service look service definition for further information.
    this.dndService.onDragStart(id, this.rowSpan, this.colSpan);

    event.dataTransfer!.effectAllowed = this.effectAllowed;

    event.dataTransfer?.setData('text/plain', id);
  }

  @HostListener('dragend', ['$event'])
  onDragEndEvent(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drag', ['$event'])
  onDragEvent(event: DragEvent) {
    event.preventDefault();
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private readonly dndService: DragAndDropService) { }
}
