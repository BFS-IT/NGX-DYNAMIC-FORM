import {
	Component as ComponentType,
	DynamicFormComponent,
	DynamicFormComposition,
	InputType,
	Media,
	MultilingualString,
	TextStyle
} from '../../shared/dynamic-form';
import {Component} from '@angular/core';
import {GridElement} from '../../dynamic-form.service';
import { FormComponentComponent } from '../../form-component/form-component.component';

@Component({
	selector: 'app-form-builder-tools',
	templateUrl: './form-builder-tools.component.html',
	styleUrl: './form-builder-tools.component.scss',
	standalone: true,
	imports: [FormComponentComponent]
})
export class FormBuilderToolsComponent {
	protected visibleComponents: DynamicFormComponent[] = [
		{
			id: 'demo-text',
			component: ComponentType.Text,
			position: {row: 0, col: 0},
			text: {de: 'Text', fr: 'Texte', it: 'Testo', en: 'Text'} as MultilingualString,
			textStyle: TextStyle.Normal
		},
		{
			id: 'demo-input',
			component: ComponentType.Input,
			position: {row: 0, col: 0},
			label: {de: 'Eingabe', fr: 'Saisie', it: 'Ingresso', en: 'Input'} as MultilingualString,
			type: InputType.String
		}
		// Here add new components
	];

	protected form: DynamicFormComposition = {
		media: Media.Large,
		components: this.visibleComponents
	};

	protected tools: GridElement[] = this.visibleComponents.map(fcd => ({
		id: fcd.id,
		row: 0,
		col: 0,
		component: fcd
	}));
}
