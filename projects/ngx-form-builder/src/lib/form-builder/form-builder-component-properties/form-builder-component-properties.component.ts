import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Component as ComponentType, DynamicFormComponent, InputType, TextStyle } from '../../shared/dynamic-form';
import { AsyncValidatorFn, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { DynamicFormService } from '../../dynamic-form.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilderPropertyMultilingualTextComponent } from './form-builder-property-multilingual-text/form-builder-property-multilingual-text.component';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilderPropertyPositionComponent } from './form-builder-property-position/form-builder-property-position.component';

type Property = {
	id: string;
	name: keyof DynamicFormComponent;
	order?: number;
	disabled?: boolean;
	validators?: ValidatorFn | ValidatorFn[];
	asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
};
type ComponentProperties = {
	componentType: ComponentType;
	properties: Property[];
};

const commonProperties: Property[] = [
	{ id: 'common.id', name: 'common.id', order: 0, disabled: true, validators: [Validators.required, Validators.minLength(3)] },
	{ id: 'common.position', name: 'position', order: 1000 }
];

const commonValueProperties: Property[] = [...commonProperties, { id: 'common.variable', name: 'variable', order: 1100 }];

// Components properties
const componentsProperties: ComponentProperties[] = [
	{
		componentType: ComponentType.Text,
		properties: [...commonProperties, { id: 'text.text', name: 'text', order: 10 }, { id: 'text.style', name: 'textStyle', order: 20 }]
	},
	{
		componentType: ComponentType.Input,
		properties: [
			...commonValueProperties,
			{ id: 'input.label', name: 'label', order: 10 },
			{ id: 'input.placeholder', name: 'placeholder', order: 20 },
			{ id: 'input.type', name: 'type', order: 30 }
		]
	}
];
// Here new component properties

@Component({
	selector: 'app-form-builder-component-properties[component]',
	templateUrl: './form-builder-component-properties.component.html',
	styleUrl: './form-builder-component-properties.component.scss',
	standalone: true,
	imports: [
		MatLabel,
		MatFormField,
		ReactiveFormsModule,
		MatOption,
		MatFormFieldModule,
		MatInputModule,
		FormBuilderPropertyMultilingualTextComponent,
		FormBuilderPropertyPositionComponent,
		MatSelectModule
	]
})
export class FormBuilderComponentPropertiesComponent implements OnInit {
	protected editableProperties: Property[] = [];
	protected formGroup = new UntypedFormGroup({});
	protected type = InputType;
	protected updateProperties = true;

	protected readonly TextStyle = TextStyle;

	private _component?: DynamicFormComponent;

	get component(): DynamicFormComponent | undefined {
		return this._component;
	}

	@Input() set component(value: DynamicFormComponent | undefined) {
		this._component = value;
		this.updateEditableProperties();
	}

	constructor(private readonly dynamicFormService: DynamicFormService) {}
	ngAfterViewInit(): void {
		this.updateEditableProperties();
	}

	ngOnInit(): void {
		this.formGroup.valueChanges
			.pipe(
				filter(() => this.formGroup.valid && !!this.component),
				tap(() => Object.assign(this.component!, this.formGroup.getRawValue()))
			)
			.subscribe();
	}

	private updateEditableProperties() {
		this.updateProperties = true;
		try {
			const componentProperties = componentsProperties.find(cp => cp.componentType === this._component?.component);
			const editableProperties = componentProperties?.properties ?? [];
			editableProperties.sort((a, b) => (a.order ?? 100000) - (b.order ?? 100000));
			this.buildForm(editableProperties);
			
			setTimeout(() => {
				this.editableProperties = editableProperties;
			}, 100)
		}
		catch (err) {
			console.log(err)
		}
		finally {
			this.updateProperties = false;
		}
	}

	private buildForm(editableProperties: Property[]) {
		this.formGroup.controls = {};
		editableProperties.forEach(property => {
			const control = new UntypedFormControl(this.component?.[property.name]);
			control.valueChanges.pipe(filter(v => v === null)).subscribe(() => control.setValue(undefined, {emitEvent: false}));
			this.formGroup.addControl(property.name.toString(), control);

			control.addValidators(property.validators ?? []);
			control.addAsyncValidators(property.asyncValidators ?? []);
			if (property.disabled) {
				control.disable();
			}
		});
		this.formGroup.patchValue(this.component!);
		console.log('tot', this.formGroup);
	}
}
