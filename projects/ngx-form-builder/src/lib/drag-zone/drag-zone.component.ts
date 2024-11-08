import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DraggableDirective } from '../directives/draggable.directive';
import { DropZoneDirective } from '../directives/drop-zone.directive';
import { DragAndDropService } from '../drag-and-drop.service';

@Component({
  selector: 'drag-zone',
  standalone: true,
  imports: [DraggableDirective, DropZoneDirective],
  templateUrl: './drag-zone.component.html',
  styleUrl: './drag-zone.component.scss'
})
export class DragZoneComponent {
  @Input()
  public widgets!: Widget[];

  @ContentChild(TemplateRef)
  public widgetTemplate!: TemplateRef<any>;

  constructor(private readonly dndService: DragAndDropService) {
  }

  public trackWidget(widget: Widget) {
    return widget.id;
  }

  public onDragStart(event: DragEvent, widgetType: Widget): void {
    this.dndService.onDragStart(event, widgetType);
  }

  public onDragEnd(event: DragEvent, widgetType: Widget): void {
    
  }
}

export interface Widget {
  id: string,
  type: object,
  properties: {
    name: string,
    type: string
  }
}
