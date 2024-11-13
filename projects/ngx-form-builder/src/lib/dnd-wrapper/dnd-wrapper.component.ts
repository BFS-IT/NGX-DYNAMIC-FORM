import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { DragAndDropService, Widget } from '../drag-and-drop.service';

@Component({
  selector: 'dnd-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './dnd-wrapper.component.html',
  styleUrl: './dnd-wrapper.component.scss'
})
export class DndWrapperComponent implements AfterViewInit {
  @ViewChild('content') content!: ElementRef;
  
  @Input() widget!: Widget;

  constructor(private dndService: DragAndDropService, private renderer: Renderer2){
  }

  ngAfterViewInit() {
    this.dndService.AddContent(this.renderer, this.content.nativeElement, this.widget.node)
  }
}
