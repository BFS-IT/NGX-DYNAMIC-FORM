import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DndGridComponent } from "ngx-form-builder";
import { DragZoneComponent } from 'ngx-form-builder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DndGridComponent, DragZoneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-dynamic-form-demo';
  constructor(){}
}
