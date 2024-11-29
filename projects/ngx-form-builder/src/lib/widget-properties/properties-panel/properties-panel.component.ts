import { Component } from '@angular/core';
import { InputTypeProperties, Position, Properties, Size } from '../../models/models';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StateService } from '../../state.service';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormArray, FormBuilder, FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';

export type FormInferType<T> = FormGroup<{
  [K in keyof T]: T[K] extends object
  ? T[K] extends Date
  ? FormControl<T[K] | null>
  : T[K] extends unknown[]
  ? FormArray<FormInferType<T[K] extends (infer V)[] ? V : T[K]>>
  : FormInferType<T[K]>
  : FormControl<T[K] | null>;
}>;

@Component({
  selector: 'properties-panel',
  standalone: true,
  imports: [MatInputModule, AsyncPipe, MatSlideToggleModule, ReactiveFormsModule],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss'
})
export class PropertiesPanelComponent {
  private readonly properties: ReplaySubject<Properties> = new ReplaySubject<Properties>(1);
  protected readonly properties$: Observable<Properties> = this.properties.asObservable();
  protected propertiesForm!: FormInferType<Properties>;

  constructor(private readonly stateService: StateService, private readonly formBuilder: FormBuilder) {

    this.stateService.currentSelectedWidget$.subscribe((widget) => {
      this.properties.next(widget.properties);
      this.propertiesForm = this.buildFormGroup(this.formBuilder, widget.properties);
      console.log(this.propertiesForm)
      
      this.propertiesForm.valueChanges.subscribe((d) => {
        this.stateService.updateWidgetProperties(widget.id, d as Properties);
      })
    })
  }

  buildFormGroup<T extends object>(fb: FormBuilder, obj: T): FormGroup {
    const group: any = {};
    
    for (const key of Object.keys(obj)) {
      let value = (obj as any)[key];
      
      // If undefined we have to set null to get no value
      if (value === undefined) {
        value = null;
      }
  
      if (Array.isArray(value)) {
        group[key] = fb.array(value.map(v => this.buildFormGroup(fb, v)));
      } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        group[key] = this.buildFormGroup(fb, value);
      } else {
        group[key] = new FormControl(value);
      }
    }
  
    return fb.group(group);
  }
  
}
