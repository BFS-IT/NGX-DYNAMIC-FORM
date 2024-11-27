import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, ElementRef, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { Cell } from '../models/grid.models';
import { DropZoneDirective } from '../../directives/drop-zone.directive';
import { Widget } from '../../models/models';
import { DndWrapperComponent } from '../../dnd-wrapper/dnd-wrapper.component';
import { GridService } from '../../grid.service';
import { ResizableDirective } from '../../directives/resizable.directive';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'dnd-grid',
  standalone: true,
  imports: [DndWrapperComponent, DropZoneDirective, ResizableDirective, MatInputModule],
  templateUrl: './dnd-grid.component.html',
  styleUrl: './dnd-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DndGridComponent implements AfterViewInit{
  @ViewChild('grid')
  private readonly grid!: ElementRef;

  @ContentChild(TemplateRef)
  public widgetTemplate!: TemplateRef<any>;

  public readonly cells = signal<Cell[]>([]);
  public readonly widgets: Signal<Widget[]>;

  constructor(private readonly gridService: GridService) {
    this.cells.set(this.gridService.generateGrid(12, 12));
    this.widgets = this.gridService.widgets;
  }

  ngAfterViewInit(): void {
    this.gridService.currentGrid = this.grid;
  }

  public changeSelected(event: Event, id: string) {
    event.preventDefault();
    this.gridService.changeSelected(id)
  }

  public trackCell(cell: Cell): string {
    return `${cell.rowPosition}|${cell.colPosition}`;
  }

  public trackWidget(widget: Widget): string {
    return `${widget.properties.position.gridRowStart}|${widget.properties.position.gridColStart}`;
  }
}