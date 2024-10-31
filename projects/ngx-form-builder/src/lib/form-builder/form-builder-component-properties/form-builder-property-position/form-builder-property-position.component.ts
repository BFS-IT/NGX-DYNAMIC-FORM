import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators} from '@angular/forms';
import {DynamicFormComponent, DynamicFormComponentPosition} from '../../../shared/dynamic-form';
import {DynamicFormService} from '../../../dynamic-form.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-form-builder-property-position',
	templateUrl: './form-builder-property-position.component.html',
	styleUrl: './form-builder-property-position.component.scss',
	standalone: true,
	imports: [MatLabel, MatFormField, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatExpansionModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormBuilderPropertyPositionComponent),
			multi: true
		}
	]
})
export class FormBuilderPropertyPositionComponent implements ControlValueAccessor, OnInit {
	@Input() propertyName?: keyof DynamicFormComponent;
	
	protected formGroup = new FormGroup({
		row: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
		col: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
		rowspan: new FormControl<number | null>(1, [Validators.min(1)]),
		colspan: new FormControl<number | null>(1, [Validators.min(1)])
	});

	constructor(private readonly dynamicFormService: DynamicFormService) {}

	ngOnInit(): void {
		this.formGroup.valueChanges.subscribe(() => {
			this.onChange(this.position);
			this.dynamicFormService.emitGridChanged();
		});
	}

	// eslint-disable-next-line
	onChange: any = () => '';

	// eslint-disable-next-line
	onTouch: any = () => '';

	// eslint-disable-next-line
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	// eslint-disable-next-line
	registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}

	writeValue(position: DynamicFormComponentPosition | null): void {
		if (position && !this.dynamicFormService.positionEquals(position, this.position)) {
			this.formGroup.patchValue(position ?? {row: 1, col: 1});
		}
	}

	protected get position(): DynamicFormComponentPosition {
		return this.formGroup.getRawValue() as DynamicFormComponentPosition;
	}
}
