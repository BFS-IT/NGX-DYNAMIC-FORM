import {Component, Input} from '@angular/core';
import {DynamicFormComponent} from '../shared/dynamic-form';
import {GridElement, RenderingMode} from '../dynamic-form.service';
import {AbstractControl, FormControl, UntypedFormControl} from '@angular/forms';

@Component({
	selector: 'app-form-component-base[element]',
	template: ''
})
export class FormComponentBaseComponent {
	get mode(): RenderingMode {
		return this._mode;
	}

	@Input() set mode(value: RenderingMode) {
		this._mode = value;
		this.modeChanged(value);
	}

	@Input() element!: GridElement;

	private _mode: RenderingMode = 'render';

	get component(): DynamicFormComponent {
		return this.element.component!;
	}

	get control(): AbstractControl {
		return this.element.control ?? new UntypedFormControl();
	}

	get formControl(): UntypedFormControl {
		return this.control as FormControl;
	}

	protected modeChanged(mode: RenderingMode): void {
		void mode;
	}
}
