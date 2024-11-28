import { Directive, HostListener, ElementRef, Renderer2, Input, HostBinding, AfterContentInit } from '@angular/core';
import { DragAndDropService } from '../drag-and-drop.service';
import { Position } from '../../models/models';
import { BehaviorSubject } from 'rxjs';
import { GridService } from '../grid.service';

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
export type DropEffect = 'move' | 'copy' | 'link' | 'none';

@Directive({
  selector: '[ndfDropzone]',
  standalone: true
})
export class DropZoneDirective implements AfterContentInit {
  private readonly VALID_DROPZONE: string = 'valid-dropzone';
  private readonly INVALID_DROPZONE: string = 'invalid-dropzone';
  private GRID_ROW_START!: number;
  private GRID_COL_START!: number;
  private involvedCellsDropzones: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>([]);

  @Input()
  public DropEffect: DropEffect = 'copy';

  @HostBinding('attr.dropzone') dropzone = this.DropEffect;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();

    const position: Position = this.dndService.calculateDraggedPosition(this.GRID_ROW_START, this.GRID_COL_START);
    const currentDropzone: HTMLElement = this.el.nativeElement;
    this.involvedCellsDropzones.next(this.dndService.getCellsDropzones(this.renderer, currentDropzone))

    if (this.gridService.isPositionAvailable(this.dndService.currentDraggedId.value, position)) {
      this.addClassToCellsDropzone(this.involvedCellsDropzones.value, this.VALID_DROPZONE);
    }
    else {
      this.addClassToCellsDropzone(this.involvedCellsDropzones.value, this.INVALID_DROPZONE);
      event.dataTransfer!.dropEffect = 'none';
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();

    this.removeClassToCellsDropzone(this.involvedCellsDropzones.value, this.VALID_DROPZONE);
    this.removeClassToCellsDropzone(this.involvedCellsDropzones.value, this.INVALID_DROPZONE);
    this.involvedCellsDropzones.next([]);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer && !this.el.nativeElement.classList.contains(this.INVALID_DROPZONE)) {
      let currentDropEffect: DropEffect = this.DropEffect;
      let effectAllowed = event.dataTransfer?.effectAllowed;

      if (effectAllowed === 'move') {
        event.dataTransfer.dropEffect = 'move';
        currentDropEffect = 'move';
      }
      else {
        event.dataTransfer.dropEffect = 'copy';
        currentDropEffect = 'copy';
      }

      const position: Position = this.dndService.calculateDraggedPosition(this.GRID_ROW_START, this.GRID_COL_START)
      const id = event.dataTransfer?.getData('text/plain');
      
      if (id) {
        if (currentDropEffect === 'move') {
          this.dndService.onMoveDrop(id, position)
        }
        else {
          this.dndService.onAddDrop(id, position)
        }
      }
    }

    this.removeClassToCellsDropzone(this.involvedCellsDropzones.value, this.VALID_DROPZONE);
    this.removeClassToCellsDropzone(this.involvedCellsDropzones.value, this.INVALID_DROPZONE);
    this.involvedCellsDropzones.next([]);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private readonly dndService: DragAndDropService,
    private readonly gridService: GridService
  ) { }

  ngAfterContentInit(): void {
    this.GRID_ROW_START = parseInt(this.el.nativeElement.style.gridRowStart);
    this.GRID_COL_START = parseInt(this.el.nativeElement.style.gridColumnStart);
  }

/**
 * Add given class to given cells.
 * @param cells cells on which add class.
 * @param classToAdd class to add on cells.
 */
  private addClassToCellsDropzone(cells: HTMLElement[], classToAdd: string) {
    for (let index = 0; index < cells.length; index++) {
      this.renderer.addClass(cells[index], classToAdd);
    }
  }

  /**
   * remove class to given cells
   * @param cells cells on which remove class.
   * @param classToRemove class to remove from cells.
   */
  private removeClassToCellsDropzone(cells: HTMLElement[], classToRemove: string) {
    for (let index = 0; index < cells.length; index++) {
      this.renderer.removeClass(cells[index], classToRemove);
    }
  }
}
