import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, pairwise, scan, shareReplay, startWith } from 'rxjs';
import { Box, Cell, Point } from '../models/grid.models';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { DraggableDirective, EffectAllowed } from '../../directives/draggable.directive';
import { DropZoneDirective } from '../../directives/drop-zone.directive';
import { DragAndDropService, Widget } from '../../drag-and-drop.service';
import { DndWrapperComponent } from '../../dnd-wrapper/dnd-wrapper.component';

@Component({
  selector: 'dnd-grid',
  standalone: true,
  imports: [AsyncPipe, DndWrapperComponent, DropZoneDirective, DraggableDirective],
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
  public readonly widgets$: Observable<Widget[]>;

  constructor(private readonly dndService: DragAndDropService) {
    this.cells$ = this.initCells();
    this.widgets$ = this.dndService.widgets$;
  }

  private initCells(): Observable<Cell[]> {
    return of(this.generateGrid());
  }

  public trackCell(cell: Cell): string {
    return `${cell.rowPosition}|${cell.colPosition}`;
  }

  public trackWidget(widget: Widget): string {
    return `${widget.properties.position.gridRowStart}|${widget.properties.position.gridColStart}`;
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
