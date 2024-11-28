import { Component } from '@angular/core';
import { Properties } from '../../models/models';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StateService } from '../../state.service';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'properties-panel',
  standalone: true,
  imports: [MatInputModule, AsyncPipe, MatSlideToggleModule],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss'
})
export class PropertiesPanelComponent {
  private readonly properties: ReplaySubject<Properties> = new ReplaySubject<Properties>(1);
  protected readonly properties$: Observable<Properties> = this.properties.asObservable();

  constructor(private readonly stateService: StateService) { 
    this.stateService.currentSelectedWidget$.subscribe((widget) => {
      this.properties.next(widget.properties);
    })
  }
}
