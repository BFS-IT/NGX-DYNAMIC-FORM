import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormComponentBaseComponent} from '../form-component-base/form-component-base.component';
import {MultilingualTextPipe} from '../shared/pipes/multilingual-text.pipe';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {RenderingMode} from '../dynamic-form.service';

@Component({
	selector: 'app-form-component-input[element]',
	templateUrl: './form-component-input.component.html',
	styleUrl: './form-component-input.component.scss',
	imports: [MultilingualTextPipe, MatLabel, MatFormField, MatInput, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
	standalone: true
})
export class FormComponentInputComponent extends FormComponentBaseComponent {
	@ViewChild('input') set input(value: ElementRef) {
		this._input = value;
		this.modeChanged(this.mode);
	}

	private _input?: ElementRef;

	protected override modeChanged(mode: RenderingMode) {
		if (mode === 'build' && this._input) {
			this._input.nativeElement.tabIndex = -1;
		}
	}
}
