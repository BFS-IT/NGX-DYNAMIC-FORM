import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilderComponent } from "ngx-form-builder";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-dynamic-form-demo';
  constructor(){}
}
