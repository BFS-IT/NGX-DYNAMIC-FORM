import { Component, signal } from '@angular/core';
import { Widget } from '../../models/models';
import { StateService } from '../../state.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'json-preview',
  standalone: true,
  imports: [NgxJsonViewerModule],
  templateUrl: './json-preview.component.html',
  styleUrl: './json-preview.component.scss'
})
export class JsonPreviewComponent {
  protected widgets = signal<Widget[]>([]);
  protected json: any;

  constructor(private readonly stateService: StateService) {
    this.widgets = this.stateService.widgets;
    console.log(this.widgets())
    this.json = JSON.stringify(this.widgets());
  }
}
