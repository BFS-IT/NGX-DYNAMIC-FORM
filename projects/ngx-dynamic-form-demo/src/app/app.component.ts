import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCommonModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatDrawerContainer, MatDrawerContent, MatDrawer } from '@angular/material/sidenav';
import { MatTab, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common'
import { PropertiesPanelComponent, DragZoneItemWrapperComponent, DndGridComponent, DragZoneComponent, JsonPreviewComponent } from 'ngx-form-builder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DndGridComponent,
    DragZoneComponent,
    MatIcon,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    MatCommonModule,
    MatTab,
    MatTabGroup,
    MatTabsModule,
    CommonModule,
    MatSelectModule,
    PropertiesPanelComponent,
    JsonPreviewComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private openedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  protected opened$: Observable<boolean>;
  title = 'ngx-dynamic-form-demo';

  constructor() {
    this.opened$ = this.openedSubject$.asObservable();
  }

  protected toggleButton() {
    this.openedSubject$.next(!this.openedSubject$.value);
  }
}
