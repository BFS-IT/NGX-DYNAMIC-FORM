import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DynamicForm, DynamicFormComposition, Media} from '../shared/dynamic-form';
import {DynamicFormService, GRID_COL_WIDTH_LARGE, GridElement, RenderingMode} from '../dynamic-form.service';
import {NgStyle} from '@angular/common';
import {FormComponentComponent} from '../form-component/form-component.component';
import {UntypedFormGroup} from '@angular/forms';

/**
 * Represents an event that is emitted when the form metadata is changed.
 */
export type FormMetaDataChangedEvent = {formMetaData: DynamicForm};

const EMPTY_ROWS = 4;

@Component({
	selector: 'app-form-grid',
	templateUrl: './form-grid.component.html',
	styleUrl: './form-grid.component.scss',
	imports: [NgStyle, FormComponentComponent],
	standalone: true
})
export class FormGridComponent implements OnInit {
	/**
	 * Defines the mode how to render the grid. If 'build' the user can change the composition
	 * of the form. If input, that the user set data in fields.
	 *
	 * @type {'build' | 'render'}
	 * @default 'render'
	 */
	@Input() mode: RenderingMode = 'render';

	@Input() formGroup?: UntypedFormGroup;

	/**
	 * Event emitter for the FormMetaDataChangedEvent.
	 */
	@Output() readonly formMetaDataChanged = new EventEmitter<FormMetaDataChangedEvent>();

	/**
	 * An EventEmitter that emits a FormGroup instance when it is filled.
	 *
	 * @event FormGroupFilled
	 */
	@Output() readonly formGroupFilled = new EventEmitter<UntypedFormGroup>();

	protected colCount: number = GRID_COL_WIDTH_LARGE;
	protected rowCount: number = EMPTY_ROWS;
	protected gridElements: GridElement[] = [];

	/**
	 * Gets the media size for responsive layout.
	 *
	 * @returns {Media} The media object.
	 */
	get media(): Media {
		return this.dynamicFormService.media;
	}

	/**
	 * Sets the media size for responsive layout.
	 *
	 * @param {Media} value - The new value for the media property.
	 */
	@Input() set media(value: Media) {
		this.dynamicFormService.setMedia(value);
	}

	private _form!: DynamicFormComposition;
	private gridTemplateAreas = '';

	constructor(private readonly dynamicFormService: DynamicFormService) {
		this._form = this.dynamicFormService.getEmptyMediaForm(this.media);
	}

	/**
	 * Represents the form metadata. This object contains the definition of
	 * the form.
	 *
	 * @type {Object} Form
	 */
	get form(): DynamicFormComposition {
		return this._form;
	}

	/**
	 * Represents the form metadata. This object contains the definition of
	 * the form.
	 *
	 * @type {Object} Form
	 */
	@Input() set form(value: DynamicFormComposition) {
		this._form = value;
		this.refreshGrid();
	}

	ngOnInit(): void {
		this.dynamicFormService.gridChanged$.subscribe(() => this.refreshGrid());
	}

	protected buildStyle(): {[key: string]: string} {
		return {
			'grid-template-areas': this.gridTemplateAreas
		};
	}

	protected buildElementStyle(element: GridElement): {[key: string]: string} {
		return {
			'grid-area': element.id
		};
	}

	private fillFormComponents(form?: DynamicFormComposition): void {
		if (!form) {
			this.gridElements = [];
		} else {
			this.gridElements = this.dynamicFormService.getGridAreasElements(form, this.mode, this.rowCount, this.colCount);
			if (this.formGroup) {
				this.formGroup.controls = {};

				this.gridElements
					.filter(ge => ge.component && ge.control && ge.component.variable)
					.forEach(ge => {
						this.formGroup!.addControl(ge.component!.variable!, ge.control);
					});
				this.formGroupFilled.emit(this.formGroup);
			}
		}
	}

	private refreshGrid() {
		this.updateGridSize();
		this.gridTemplateAreas = this.form ? this.dynamicFormService.buildGridTemplateArea(this.form, this.mode, this.rowCount, this.colCount) : '';
		this.fillFormComponents(this.form);
	}

	private updateGridSize() {
		this.colCount = this.dynamicFormService.getGridColWidthByMedia(this.media);
		this.rowCount = this.dynamicFormService.getMaxRows(this.form) + EMPTY_ROWS;
	}
}
