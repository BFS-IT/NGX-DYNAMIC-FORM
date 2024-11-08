import { Directive, HostListener, ElementRef, Renderer2, Input, HostBinding } from '@angular/core';

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
export type DropEffect = 'move' | 'copy' | 'link' | 'none';

@Directive({
  selector: '[ndfDrag]',
  standalone: true
})
export class DraggableDirective {
  @HostBinding('attr.draggable') draggable = true;
  @HostBinding('class') classes = 'draggable';
  
  @HostListener('dragstart', ['$event'])
  onDragStartEvent(event: DragEvent) {
    const id = (event.target as HTMLElement).id; 
    event.dataTransfer?.setData('text/plain', id); 
    event.dataTransfer?.setData('application/x-moz-node', (event.target as HTMLElement).outerHTML);
  }

  @HostListener('dragend', ['$event'])
  onDragEndEvent(event: DragEvent) {
    
  }

  @HostListener('drag', ['$event'])
  onDragEvent(event: DragEvent) {
    
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    
  }
}
