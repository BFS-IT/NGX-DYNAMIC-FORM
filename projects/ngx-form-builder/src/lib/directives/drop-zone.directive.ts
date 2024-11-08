import { Directive, HostListener, ElementRef, Renderer2, Output, EventEmitter, Input, HostBinding } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DropEffect } from './draggable.directive';

@Directive({
  selector: '[ndfDropzone]',
  standalone: true
})
export class DropZoneDirective {
  @Output() dropped = new EventEmitter<string>();

  @Input()
  private DropEffect: DropEffect = 'copy';

  @HostBinding('attr.dropzone') dropzone = this.DropEffect;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.renderer.addClass(this.el.nativeElement, 'valid-dropzone');
  }

  @HostListener('dragleave')
  onDragLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'valid-dropzone');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.renderer.removeClass(this.el.nativeElement, 'valid-dropzone');
    const data = event.dataTransfer?.getData('application/x-moz-node') || event.dataTransfer?.getData('text/plain');

    if (data) { 
      const copy = this.renderer.createElement('div'); 
      this.renderer.setProperty(copy, 'innerHTML', data); 
      this.renderer.appendChild(this.el.nativeElement, copy.firstChild); 
      this.dropped.emit(data);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }
}
