import { Component, HostBinding, Input, Type } from '@angular/core';
import { Size } from '../drag-and-drop.service';

@Component({
  selector: 'drag-zone-item-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './drag-zone-item-wrapper.component.html',
  styleUrl: './drag-zone-item-wrapper.component.scss',
})
export class DragZoneItemWrapperComponent {
  @HostBinding('attr.id') id = 'dzcomponent-' + crypto.randomUUID();
  @HostBinding('class') class = 'drag-zone-item-wrapper';
  
  constructor(){}
}
