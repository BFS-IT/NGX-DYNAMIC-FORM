import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DraggableDirective } from '../directives/draggable.directive';
import { Widget } from '../drag-and-drop.service';
import { DragZoneItemWrapperComponent } from "../drag-zone-item-wrapper/drag-zone-item-wrapper.component";

@Component({
  selector: 'drag-zone',
  standalone: true,
  imports: [DraggableDirective, DragZoneItemWrapperComponent],
  templateUrl: './drag-zone.component.html',
  styleUrl: './drag-zone.component.scss'
})
export class DragZoneComponent {
  @ViewChildren('drag-zone-item-wrapper', {read: ElementRef})
  public dragZoneItemWrappers!: QueryList<ElementRef<DragZoneItemWrapperComponent>>;

  constructor() {}

  /**
   * Track widget using id.
   * @param widget widget on which track should be down.
   * @returns given widget id.
   */
  public trackWidget(widget: Widget) {
    return widget.id;
  }

  public onDragStart(event: DragEvent): void {}

  public onDragEnd(event: DragEvent): void {}
}
