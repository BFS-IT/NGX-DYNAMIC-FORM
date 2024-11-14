import { Directive, HostListener, Input, HostBinding } from '@angular/core';
import { DragAndDropService, Position, Size } from '../drag-and-drop.service';

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
    const id = (event.currentTarget as HTMLElement).id;

    // Store current dragged element in service look service definition for further information.
    this.dndService.onDragStart(
      id,
      {
        minimalSize: {
          gridRowSpan: this.rowSpan,
          gridColSpan: this.colSpan
        }
      } as Size);

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

  constructor(private readonly dndService: DragAndDropService) { }
}
