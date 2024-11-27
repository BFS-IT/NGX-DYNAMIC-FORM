import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DraggableDirective } from '../directives/draggable.directive';
import { Widget } from '../models/models';
import { DragZoneItemWrapperComponent } from "../drag-zone-item-wrapper/drag-zone-item-wrapper.component";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'drag-zone',
  standalone: true,
  imports: [DraggableDirective, DragZoneItemWrapperComponent, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './drag-zone.component.html',
  styleUrl: './drag-zone.component.scss'
})
export class DragZoneComponent {
  @ViewChildren('drag-zone-item-wrapper', { read: ElementRef })
  public dragZoneItemWrappers!: QueryList<ElementRef<DragZoneItemWrapperComponent>>;

  constructor() { }

  /**
   * Track widget using id.
   * @param widget widget on which track should be down.
   * @returns given widget id.
   */
  public trackWidget(widget: Widget) {
    return widget.id;
  }

  public onDragStart(event: DragEvent): void { }

  public onDragEnd(event: DragEvent): void { }
}
