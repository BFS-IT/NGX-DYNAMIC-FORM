import { Component, HostBinding } from '@angular/core';

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
