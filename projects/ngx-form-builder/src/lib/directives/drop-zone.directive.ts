import { Directive, HostListener, ElementRef, Renderer2, Output, EventEmitter, Input, HostBinding, Component, Type } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DragAndDropService, Position } from '../drag-and-drop.service';
import { DndWrapperComponent } from '../dnd-wrapper/dnd-wrapper.component';
import { DragZoneComponent } from '../drag-zone/drag-zone.component';
import { DragZoneItemWrapperComponent } from '../drag-zone-item-wrapper/drag-zone-item-wrapper.component';

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
export type DropEffect = 'move' | 'copy' | 'link' | 'none';

@Directive({
  selector: '[ndfDropzone]',
  standalone: true
})
export class DropZoneDirective {
  @Output() dropped = new EventEmitter<string>();

  @Input()
  public DropEffect: DropEffect = 'copy';

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
    
    const currentDropzone: HTMLElement = this.el.nativeElement;
    const gridRowStart: number = parseInt(currentDropzone.style.gridRowStart);
    let gridRowEnd: number = parseInt(currentDropzone.style.gridRowEnd);
    const gridColStart: number = parseInt(currentDropzone.style.gridColumnStart);
    let gridColEnd: number = parseInt(currentDropzone.style.gridColumnEnd);

    // We should check if end positions are NaN because of cell that have no end positions.
    if (Number.isNaN(gridRowEnd)) {
      gridRowEnd = 1;
    }
    if (Number.isNaN(gridColEnd)) {
      gridColEnd = 1;
    }

    let currentDropEffect: DropEffect = this.DropEffect;
    if (event.dataTransfer) {
      let effectAllowed = event.dataTransfer?.effectAllowed;

      if (effectAllowed === 'move') {
        event.dataTransfer.dropEffect = 'move';
        currentDropEffect = 'move';
      }
      else {
        event.dataTransfer.dropEffect = 'copy';
        currentDropEffect = 'copy';
      }

      const position: Position = {
        gridRowStart: gridRowStart,
        gridRowEnd: gridRowEnd,
        gridColStart: gridColStart,
        gridColEnd: gridColEnd
      };

      this.renderer.removeClass(this.el.nativeElement, 'valid-dropzone');
      const id = event.dataTransfer?.getData('text/plain');

      if (id) {
        if (currentDropEffect === 'move') {
          this.dndService.onMoveDrop(id, position)
        }
        else {
          this.dndService.onAddDrop(id, position)
        }

        this.dropped.emit("");
      }
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private readonly dndService: DragAndDropService) {

  }
}
