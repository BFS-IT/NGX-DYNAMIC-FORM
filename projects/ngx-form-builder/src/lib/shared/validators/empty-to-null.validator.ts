import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Hack to ensure that if the control value is an empty string, then the value become null.
 */
export const emptyToNullValidator = (defaultValue: null | undefined = null): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
		if (control.value === '') {
			control.setValue(defaultValue);
		}
		return null;
	};
};
