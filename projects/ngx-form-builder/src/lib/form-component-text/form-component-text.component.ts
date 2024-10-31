import {Component} from '@angular/core';
import {FormComponentBaseComponent} from '../form-component-base/form-component-base.component';
import {MultilingualTextPipe} from '../shared/pipes/multilingual-text.pipe';
import {TextStyle} from '../shared/dynamic-form';

@Component({
	selector: 'app-form-component-text[element]',
	templateUrl: './form-component-text.component.html',
	styleUrl: './form-component-text.component.scss',
	imports: [MultilingualTextPipe],
	standalone: true
})
export class FormComponentTextComponent extends FormComponentBaseComponent {
	protected readonly TextStyle = TextStyle;
}
