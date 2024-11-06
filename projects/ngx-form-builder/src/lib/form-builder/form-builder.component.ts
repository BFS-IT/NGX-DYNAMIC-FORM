import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DynamicFormService} from '../dynamic-form.service';
import {DynamicForm, DynamicFormComponent, DynamicFormComposition, Media} from '../shared/dynamic-form';
import {FormControl, Validators} from '@angular/forms';
import {BehaviorSubject, filter, Observable} from 'rxjs';
import {MatTab, MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatLabel } from '@angular/material/form-field';
import { FormBuilderToolsComponent } from './form-builder-tools/form-builder-tools.component';
import { FormBuilderComponentPropertiesComponent } from './form-builder-component-properties/form-builder-component-properties.component';
import { MatIcon } from '@angular/material/icon';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FormGridComponent } from '../form-grid/form-grid.component';
import {MatDrawerContainer, MatDrawerContent, MatDrawer} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
	selector: 'app-form-builder',
	templateUrl: './form-builder.component.html',
	styleUrl: './form-builder.component.scss',
	standalone: true,
	imports: [
		CommonModule,
		MatLabel, 
		MatTabsModule, 
		FormBuilderToolsComponent, 
		FormBuilderComponentPropertiesComponent, 
		MatIcon, 
		NgxJsonViewerModule, 
		FormGridComponent,
		MatDrawerContainer,
		MatDrawerContent,
		MatDrawer,
		MatButtonModule,
		MatTooltipModule
	]
})
export class FormBuilderComponent implements OnInit, AfterViewInit {
	@ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

	protected readonly Media = Media;
	protected mainForm: DynamicForm;
	protected mainFormView: DynamicForm;
	protected formNames: string[] = [];
	protected formName = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);
	private openedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	protected opened$: Observable<boolean>;

	constructor(
		private readonly dynamicFormService: DynamicFormService,
		private readonly clipboard: Clipboard
	) {
		this.mainForm = this.dynamicFormService.emptyForm;
		this.mainFormView = this.mainForm;
		this.opened$ = this.openedSubject$.asObservable();
	}

	ngOnInit(): void {
		this.reloadFormList();
		this.dynamicFormService.selectedId$.pipe(filter(id => !!this.form.components.find(c => c.id === id))).subscribe(() => this.gotoSettings());
		this.dynamicFormService.gridChanged$.subscribe(() => (this.mainFormView = JSON.parse(JSON.stringify(this.mainForm))));
	}

	ngAfterViewInit(): void {
		// this.dynamicFormService.loadFromAssets('life-stats.test').subscribe(form => (this.mainForm = form));
		this.createNewForm();
	}

	protected get media(): Media {
		return this.dynamicFormService.media;
	}

	protected get form(): DynamicFormComposition {
		let form = this.mainForm.forms.find(f => f.media === this.media);
		if (!form) {
			form = this.dynamicFormService.getEmptyMediaForm(this.media);
			this.mainForm.forms.push(form);
		}
		return form;
	}

	protected get selectedComponent(): DynamicFormComponent | undefined {
		return this.form.components.find(c => c.id === this.dynamicFormService.selectedId);
	}

	protected createNewForm() {
		this.mainForm = this.dynamicFormService.emptyForm;
		this.mainForm.name = 'New form';
		this.formName.setValue(this.mainForm.name);
	}

	protected setMedia(media: Media) {
		this.dynamicFormService.setMedia(media);
	}

	protected copyJson() {
		this.clipboard.copy(JSON.stringify(this.mainForm, null, 2));
	}

	private reloadFormList() {
		this.formNames = this.dynamicFormService.getSavedFormListFromLocalStorage();
	}

	private gotoSettings() {
		this.tabGroup.selectedIndex = 1;
	}

	protected toggleButton() {
		this.openedSubject$.next(!this.openedSubject$.value);
	}
}
