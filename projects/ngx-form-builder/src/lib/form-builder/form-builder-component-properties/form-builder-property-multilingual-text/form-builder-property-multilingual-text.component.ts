import {Component, Input, OnInit, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormComponent, MultilingualString} from '../../../shared/dynamic-form';
import {TranslateService} from '@ngx-translate/core';
import {emptyToNullValidator} from '../../../shared/validators/empty-to-null.validator';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-form-builder-property-multilingual-text',
	templateUrl: './form-builder-property-multilingual-text.component.html',
	styleUrl: './form-builder-property-multilingual-text.component.scss',
	standalone: true,
	imports: [MatLabel, MatFormField, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormBuilderPropertyMultilingualTextComponent),
			multi: true
		}
	]
})
export class FormBuilderPropertyMultilingualTextComponent implements ControlValueAccessor, OnInit {
	@Input() propertyName?: keyof DynamicFormComponent;

	protected formGroup = new FormGroup({
		de: new FormControl<string | null>(null, emptyToNullValidator(undefined)),
		fr: new FormControl<string | null>(null, emptyToNullValidator(undefined)),
		it: new FormControl<string | null>(null, emptyToNullValidator(undefined)),
		en: new FormControl<string | null>(null, emptyToNullValidator(undefined))
	});

	protected language: string;

	constructor(private readonly translateService: TranslateService) {
		this.language = this.translateService.currentLang ?? 'fr';
	}

	protected get selectedLanguageControl(): FormControl {
		return this.formGroup.get(this.language) as FormControl;
	}

	ngOnInit(): void {
		this.formGroup.valueChanges.subscribe(value => {
			if (!value.de && !value.fr && !value.it && !value.en) {
				this.onChange(undefined);
			} else {
				this.onChange(value);
			}
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

	writeValue(multilingualText: MultilingualString | null): void {
		this.formGroup.patchValue(multilingualText ?? {});
	}
}
