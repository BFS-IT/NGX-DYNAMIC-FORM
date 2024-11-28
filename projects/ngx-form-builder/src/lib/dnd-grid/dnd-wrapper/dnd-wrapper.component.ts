import { AfterViewInit, Component, ElementRef,  Input, Renderer2, ViewChild } from '@angular/core';
import { DragAndDropService } from '../drag-and-drop.service';
import { Widget } from '../../models/models';
import { DraggableDirective } from '../directives/draggable.directive';

@Component({
  selector: 'dnd-wrapper',
  standalone: true,
  imports: [DraggableDirective],
  templateUrl: './dnd-wrapper.component.html',
  styleUrl: './dnd-wrapper.component.scss'
})
export class DndWrapperComponent implements AfterViewInit {
  @ViewChild('content') content!: ElementRef;
  
  @Input() widget!: Widget;

  constructor(private dndService: DragAndDropService, private renderer: Renderer2, private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.dndService.addContent(this.renderer, this.content.nativeElement, this.widget.node);
  }
}