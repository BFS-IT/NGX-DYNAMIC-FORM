import { Component, ContentChild, ElementRef, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { DraggableDirective } from '../directives/draggable.directive';
import { DropZoneDirective } from '../directives/drop-zone.directive';
import { DragAndDropService, Widget } from '../drag-and-drop.service';
import { NumberSymbol } from '@angular/common';
import { DndWrapperComponent } from "../dnd-wrapper/dnd-wrapper.component";
import { DndGridComponent } from "../dnd-grid/grid/dnd-grid.component";
import { DragZoneItemWrapperComponent } from "../drag-zone-item-wrapper/drag-zone-item-wrapper.component";

@Component({
  selector: 'drag-zone',
  standalone: true,
  imports: [DraggableDirective, DndWrapperComponent, DndGridComponent, DragZoneItemWrapperComponent],
  templateUrl: './drag-zone.component.html',
  styleUrl: './drag-zone.component.scss'
})
export class DragZoneComponent {
  @ViewChildren('drag-zone-item-wrapper', {read: ElementRef})
  dragZoneItemWrappers!: QueryList<ElementRef<DragZoneItemWrapperComponent>>;

  constructor() {
  }

  public trackWidget(widget: Widget) {
    return widget.id;
  }

  public onDragStart(event: DragEvent, widgetType: Widget): void {
  }

  public onDragEnd(event: DragEvent, widgetType: Widget): void {
    
  }
}
