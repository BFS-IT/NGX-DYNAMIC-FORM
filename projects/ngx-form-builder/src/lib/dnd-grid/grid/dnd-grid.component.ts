import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, pairwise, scan, shareReplay, startWith } from 'rxjs';
import { Box, Cell, Point } from '../models/grid.models';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { DraggableDirective } from '../../directives/draggable.directive';
import { DropZoneDirective } from '../../directives/drop-zone.directive';

@Component({
  selector: 'dnd-grid',
  standalone: true,
  imports: [AsyncPipe, DraggableDirective, DropZoneDirective],
  templateUrl: './dnd-grid.component.html',
  styleUrl: './dnd-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DndGridComponent {
  @ViewChild('grid')
  private readonly grid!: ElementRef;

  @ContentChild(TemplateRef)
  public widgetTemplate!: TemplateRef<any>;

  public readonly cells$: Observable<Cell[]>;

  constructor() {
    this.cells$ = this.initCells();
  }

  private initCells(): Observable<Cell[]> {
    return of(this.generateGrid());
  }

  /**
  * Generate the cells for the given grid size.
  * 
  * @return {Cell[]}
  */
  public generateGrid(): Cell[] {
    const grid: Cell[] = [];
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 12; col++) {
        const cell = { rowPosition: row + 1, colPosition: col + 1 } as Cell;
        grid.push(cell);
      }
    }
    return grid;
  }
}
