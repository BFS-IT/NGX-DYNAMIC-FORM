import { Directive, HostListener, Input, HostBinding } from '@angular/core';

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
export type EffectAllowed = 'move' | 'copy' | 'link' | 'none' | 'copyMove' | 'copyLink' | 'linkMove' | 'all' | "uninitialized";

@Directive({
  selector: '[ndfDrag]',
  standalone: true
})
export class DraggableDirective {
  @Input() effectAllowed: EffectAllowed = 'copy';

  @HostBinding('attr.draggable') draggable = true;
  @HostBinding('class') classes = 'draggable';
  
  @HostListener('dragstart', ['$event'])
  onDragStartEvent(event: DragEvent) {
    event.dataTransfer!.effectAllowed = this.effectAllowed;
    const id = (event.currentTarget as HTMLElement).id;

    event.dataTransfer?.setData('text/plain', id);
  }

  @HostListener('dragend', ['$event'])
  onDragEndEvent(event: DragEvent) {}

  @HostListener('drag', ['$event'])
  onDragEvent(event: DragEvent) {}

  constructor() {}
}
