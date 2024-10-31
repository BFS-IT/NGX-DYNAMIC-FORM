import {Injectable} from '@angular/core';
import {Convert, DynamicForm, DynamicFormComponent, DynamicFormComponentPosition, DynamicFormComposition, Media} from './shared/dynamic-form';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, map} from 'rxjs';
import {LocalService} from './local.service';
import {TranslateService} from '@ngx-translate/core';
import {AbstractControl, UntypedFormControl} from '@angular/forms';

export type GridDirection = 'up' | 'down' | 'left' | 'right';
export type RenderingMode = 'build' | 'render';

export const GRID_COL_WIDTH_LARGE: number = 12;
export const GRID_COL_WIDTH_MEDIUM: number = 8;
export const GRID_COL_WIDTH_SMALL: number = 4;

export const GRID_GAP: number = 7;
export const GRID_STYLE_GAP_MARGIN: string = `${GRID_GAP / 2}px`;
export const GRID_TEMPLATE_EMPTY: string = 'e';
const LOCAL_STORAGE_KEY_PREFIX: string = 'dynamic-form-definition:';

/**
 * Interface representing an element that appear on the grid.
 * @interface
 */
export interface GridElement {
	id: string;
	row: number;
	col: number;
	component?: DynamicFormComponent;
	control?: AbstractControl;
}

@Injectable({
	providedIn: 'root'
})
export class DynamicFormService {
	/**
	 * Represents an observable that emmit the selected ID (component or element) in a grid.
	 *
	 * @property {string | undefined} value - The current selected ID, or undefined if no component or element selected.
	 */
	selectedId$ = new BehaviorSubject<string | undefined>(undefined);

	/**
	 * Represents an observable that emmit the selected ID (component or element) in a grid.
	 *
	 * @property {string | undefined} value - The current selected ID, or undefined if no component or element selected.
	 */
	media$!: Observable<Media>;

	/**
	 * An observable subject for tracking changes to a grid.
	 */
	gridChanged$!: Observable<unknown>;

	private readonly gridChangedSubject = new Subject();
	private readonly mediaSubject = new BehaviorSubject<Media>(Media.Large);

	constructor(
		private readonly http: HttpClient,
		private readonly localService: LocalService,
		private readonly translateService: TranslateService
	) {
		this.gridChanged$ = this.gridChangedSubject.asObservable();
		this.media$ = this.mediaSubject.asObservable();
		this.emitGridChanged();
		this.translateService.onLangChange.subscribe(() => this.emitGridChanged());
	}

	/**
	 * Gets an empty form object with all types of media.
	 *
	 * @return {DynamicForm} An empty form object containing default values and predefined media forms.
	 */
	get emptyForm(): DynamicForm {
		return {
			name: '',
			forms: [this.getEmptyMediaForm(Media.Large), this.getEmptyMediaForm(Media.Medium), this.getEmptyMediaForm(Media.Small)]
		};
	}

	/**
	 * Generates an empty media form structure.
	 *
	 * @param {Media} media - The media object to associate with the form.
	 * @return {DynamicFormComposition} A new form composition with the given media and empty components.
	 */
	getEmptyMediaForm(media: Media): DynamicFormComposition {
		return {
			media,
			components: []
		};
	}

	/**
	 * Retrieves the currently selected component ID.
	 *
	 * @returns {GridElement | undefined} The selected component ID, or undefined if no component is selected.
	 */
	get selectedId(): string | undefined {
		return this.selectedId$.value;
	}

	/**
	 * Returns the current media type.
	 *
	 * @return {Media} The current media.
	 */
	get media(): Media {
		return this.mediaSubject.value;
	}

	emitGridChanged() {
		this.gridChangedSubject.next(undefined);
	}

	/**
	 * Retrieves a list of saved form names from local storage.
	 *
	 * @returns {string[]} The list of saved form names.
	 */
	getSavedFormListFromLocalStorage(): string[] {
		const formNames = [];
		for (let keyIndex = 0; keyIndex < this.localService.length; keyIndex++) {
			const localStorageName = this.localService.getKey(keyIndex);
			if (localStorageName?.startsWith(LOCAL_STORAGE_KEY_PREFIX)) {
				formNames.push(localStorageName?.substring(LOCAL_STORAGE_KEY_PREFIX.length));
			}
		}
		return formNames;
	}

	/**
	 * Loads a form from the local storage.
	 *
	 * @param {string} formName - The name of the form to load.
	 * @return {DynamicForm} - The loaded form.
	 * @throws {Error} - If the form doesn't exist in the local storage.
	 */
	loadFromLocalStorage(formName: string): DynamicForm {
		const key = this.getLocalStorageKey(formName);
		const formJson = this.localService.getData(key);
		if (!formJson) {
			throw new Error(`The form ${formName} doesn't exists in the local storage`);
		}
		return Convert.toDynamicForm(formJson);
	}

	/**
	 * Saves a DynamicForm object to local storage. The saved name
	 * comes form the form name in form itself.
	 *
	 * @param {DynamicForm} form - The DynamicForm object to be saved.
	 */
	saveToLocalStorage(form: DynamicForm): void {
		const formJson = Convert.dynamicFormToJson(form);
		const key = this.getLocalStorageKey(form.name);
		this.localService.saveData(key, formJson);
	}

	/**
	 * Deletes a form from local storage.
	 *
	 * @param {string} name - The name of the form to delete.
	 */
	deleteFormFromLocalStorage(name: string): void {
		this.localService.removeData(this.getLocalStorageKey(name));
	}

	/**
	 * Loads a form from the asset directory.
	 *
	 * @param {string} formName - The name of the form file.
	 * @return {Observable<DynamicForm>} Returns an observable that emits the loaded form.
	 */
	loadFromAssets(formName: string): Observable<DynamicForm> {
		return this.http.get(`/assets/forms/${formName}.form.json`, {responseType: 'text'}).pipe(map(res => Convert.toDynamicForm(res)));
	}

	/**
	 * Returns an array of GridElements from the provided form, based on the
	 * given rowCount and colCount.
	 * This array represents the elements in order to place in CSS grid
	 * built by the buildGridTemplateArea method
	 *
	 * @param {DynamicFormComposition} form - The form to search for GridElements.
	 * @param {RenderingMode} mode - The rendering mode.
	 * @param {number} rowCount - The number of rows in the grid.
	 * @param {number} colCount - The number of columns in the grid.
	 * @return {GridElement[]} - An array of GridElements, where each element represents a component in the grid.
	 */
	getGridAreasElements(form: DynamicFormComposition, mode: RenderingMode, rowCount: number, colCount: number): GridElement[] {
		const components: GridElement[] = [];
		const addedComponent = new Set<string>();
		for (let row = 1; row <= rowCount; row++) {
			for (let col = 1; col <= colCount; col++) {
				const component = this.findComponent(form, row, col);
				if (component && !addedComponent.has(component.id)) {
					components.push({
						id: this.getElementId(row, col, component),
						row,
						col,
						component,
						control: mode === 'render' ? new UntypedFormControl(null) : undefined
					});
					addedComponent.add(component.id);
				} else if (!component && mode === 'build') {
					components.push({
						id: this.getElementId(row, col),
						row,
						col,
					});
				}
			}
		}

		return components;
	}

	/**
	 * Builds the CSS grid template areas based on the provided form, row count, and column count.
	 *
	 * @param {DynamicFormComposition} form - The form object used to build the grid template areas.
	 * @param {RenderingMode} mode - The rendering mode.
	 * @param {number} rowCount - The number of rows in the grid.
	 * @param {number} colCount - The number of columns in the grid.
	 * @returns {Object} - The CSS grid template areas as an object with the 'grid-template-areas' property.
	 */
	buildGridTemplateArea(form: DynamicFormComposition, mode: RenderingMode, rowCount: number, colCount: number): string {
		let area = '';
		for (let row = 1; row <= rowCount; row++) {
			let rowArea = '';
			for (let col = 1; col <= colCount; col++) {
				const component = this.findComponent(form, row, col);
				if (mode === 'render' && !component) {
					rowArea += '. ';
				} else {
					rowArea += `${this.getElementId(row, col, component)} `;
				}
			}
			area += `"${rowArea.trim()}" `;
		}

		return area.trim();
	}

	/**
	 * Finds a form component at the specified row and column position within a form grid.
	 *
	 * @param {DynamicFormComposition} form - The form to search for the component.
	 * @param {number} row - The row position of the component.
	 * @param {number} col - The column position of the component.
	 * @return {DynamicFormComponent | undefined} - The form component found at the specified position, or undefined if not found.
	 */
	findComponent(form: DynamicFormComposition, row: number, col: number): DynamicFormComponent | undefined {
		return form.components.find(
			c =>
				row >= c.position.row &&
				row <= c.position.row + (c.position.rowspan ?? 1) - 1 &&
				col >= c.position.col &&
				col <= c.position.col + (c.position.colspan ?? 1) - 1
		);
	}

	/**
	 * Returns the element ID based on the provided row and column.
	 *
	 * @param {number} row - The row index.
	 * @param {number} col - The column index.
	 * @param {DynamicFormComponent} [component] - The optional form component definition.
	 * @returns {string} The element ID.
	 */
	getElementId(row: number, col: number, component?: DynamicFormComponent): string {
		if (component) {
			return component.id;
		}
		return `${GRID_TEMPLATE_EMPTY}-${row}-${col}`;
	}

	/**
	 * Sets the selected component ID and emit event trough selectedId$ observable.
	 * The event is emitted if the id changed since last emitted event or if
	 * force is true.
	 *
	 * @param {string} id - The component ID to be selected.
	 * @param {boolean} force - Force to emit event.
	 * @return {void}
	 */
	setSelectedComponent(id: string, force: boolean = false): void {
		if (force || id !== this.selectedId) {
			this.selectedId$.next(id);
		}
	}

	/**
	 * Checks if there is a close element in a specified direction from a given element in a form.
	 *
	 * @param {DynamicFormComposition} form - The form in which the element exists.
	 * @param {GridElement} element - The element from which to check if there is a close element.
	 * @param {GridDirection} direction - The direction in which to check for a close element. Possible values are 'up', 'down', 'left', and 'right'.
	 *
	 * @returns {boolean} - Returns true if there is a close element in the specified direction, false otherwise.
	 */
	hasCloseElement(form: DynamicFormComposition, element: GridElement, direction: GridDirection): boolean {
		const checkForRow = (position: DynamicFormComponentPosition) => {
			const row = position.row + (direction === 'up' ? -1 : (position.rowspan ?? 1));
			if (row === 0) return false;
			return [...Array(position.colspan ?? 1).keys()]
				.map(i => i + position.col)
				.some(col => {
					const component = this.findComponent(form, row, col);
					return !!component;
				});
		};
		const checkForCol = (position: DynamicFormComponentPosition): boolean => {
			const col = position.col + (direction === 'left' ? -1 : (position.colspan ?? 1));
			if (col === 0) return false;
			return [...Array(position.rowspan ?? 1).keys()].map(i => i + position.row).some(row => !!this.findComponent(form, row, col));
		};

		if (element.component) {
			switch (direction) {
				case 'up':
				case 'down':
					return checkForRow(element.component.position);
				case 'left':
				case 'right':
					return checkForCol(element.component.position);
			}
		}
		return true;
	}

	/**
	 * Determines if a given component has conflict with any other component at a
	 * specified row and column position.
	 *
	 * @param {DynamicFormComposition} form - The form object.
	 * @param {DynamicFormComponent} component - The component to check for conflict.
	 * @param {number} row - The row position.
	 * @param {number} col - The column position.
	 * @param {number} rowspan - The row span to use, if not specified, use the component rowspan
	 * @param {number} colspan - The col span to use, if not specified, use the component colspan
	 * @return {boolean} - Returns true if the component has conflict with any other component, false otherwise.
	 */
	hasConflictAtPosition(form: DynamicFormComposition, component: DynamicFormComponent, row: number, col: number, rowspan?: number, colspan?: number): boolean {
		const position = component.position;
		rowspan ??= position.rowspan ?? 1;
		colspan ??= position.colspan ?? 1;
		for (let checkedRow = row; checkedRow < row + rowspan; checkedRow++) {
			for (let checkedCol = col; checkedCol < col + colspan; checkedCol++) {
				const foundComponent = this.findComponent(form, checkedRow, checkedCol);
				if (foundComponent && foundComponent.id !== component.id) {
					return true;
				}
			}
		}
		return false;
	}

	isOutOfGrid(position: DynamicFormComponentPosition, gridColWidth: number): boolean {
		if (position.row < 0 || position.col < 0) {
			return true;
		}
		return position.col + (position.colspan ?? 1) - 1 > gridColWidth;
	}

	/**
	 * Add a component at a specified position in a form.
	 *
	 * @param {DynamicFormComposition} form - The form object to add the component to.
	 * @param {DynamicFormComponent} component - The component to be added.
	 * @param {number} row - The row position where the component will be placed.
	 * @param {number} col - The column position where the component will be placed.
	 *
	 * @return {DynamicFormComponent} - The added component with updated position and ID.
	 */
	addComponentAtPosition(form: DynamicFormComposition, component: DynamicFormComponent, row: number, col: number): DynamicFormComponent {
		if (this.findComponent(form, row, col)) {
			throw new Error('A component cannot be added in an already taken position');
		}

		const newComponent = JSON.parse(JSON.stringify(component));
		newComponent.position.row = row;
		newComponent.position.col = col;
		newComponent.id = `component-${Date.now()}`;
		form.components.push(newComponent);
		this.emitGridChanged();
		return newComponent;
	}

	/**
	 * Moves a component with the given id to the specified position in the form.
	 *
	 * @param {DynamicFormComposition} form - The form object.
	 * @param {string} id - The id of the component to be moved.
	 * @param {number} row - The row position for the component.
	 * @param {number} col - The column position for the component.
	 * @throws {Error} If the component with the given id does not exist in the form.
	 * @throws {Error} If the specified position is already occupied by another component.
	 */
	moveComponentByIdAtPosition(form: DynamicFormComposition, id: string, row: number, col: number): void {
		const movedComponent = form.components.find(c => c.id === id);
		if (!movedComponent) {
			throw new Error(`The component with id '${id}' doesnt exists in specified form`);
		}

		// Check if there is a movement, if not do anything
		if (movedComponent.position.row === row && movedComponent.position.col === col) {
			return;
		}

		if (this.hasConflictAtPosition(form, movedComponent, row, col)) {
			throw new Error('A component cannot be moved in an already taken position');
		}

		movedComponent.position.row = row;
		movedComponent.position.col = col;
		this.emitGridChanged();
	}

	/**
	 * Span the specified component in specified direction up to the specified spanning.
	 *
	 * @param {DynamicFormComposition} form - The form containing the component.
	 * @param {DynamicFormComponent} component - The component to change the span of.
	 * @param {number} spanning - The number of cells the spanning should grow. If value is negative, the spanning will reduce.
	 * @param {GridDirection} direction - The direction where the component should be spanned.
	 * @throws {Error} If the new span conflicts with other components in the form.
	 * @returns {void}
	 */
	spanComponent(form: DynamicFormComposition, component: DynamicFormComponent, spanning: number, direction: GridDirection): void {
		if (Math.abs(spanning) === 0) {
			return;
		}

		const position = component.position;
		// Calculate the final position
		const finalPosition = this.calculateSpanFinalPosition(position, spanning, direction);
		if (this.positionEquals(position, finalPosition)) {
			// Nothing changed, do nothing
			return;
		}

		// Check for conflicts
		if (this.hasConflictAtPosition(form, component, finalPosition.row, finalPosition.col, finalPosition.rowspan, finalPosition.colspan)) {
			throw new Error('A component cannot be spanned in an already taken position');
		}

		// Set new values
		component.position = finalPosition;
		// Emit that the grid changed
		this.emitGridChanged();
	}

	/**
	 * Removes a component from a form.
	 *
	 * @param {DynamicFormComposition} form - The form from which the component will be removed.
	 * @param {DynamicFormComponent | undefined} component - The component to remove from the form.
	 * @return {void} - Nothing is returned.
	 */
	removeComponent(form: DynamicFormComposition, component: DynamicFormComponent | undefined) {
		const index = form.components.findIndex(c => c.id === component?.id);
		if (index > -1) {
			form.components.splice(index, 1);
			this.emitGridChanged();
		}
	}

	/**
	 * Determines whether two {@link DynamicFormComponentPosition} objects are equal.
	 *
	 * @param {DynamicFormComponentPosition} position1 - The first position object to compare.
	 * @param {DynamicFormComponentPosition} position2 - The second position object to compare.
	 * @return {boolean} Returns true if the two position objects are equal, otherwise returns false.
	 */
	positionEquals(position1: DynamicFormComponentPosition, position2: DynamicFormComponentPosition) {
		return (
			position1.row === position2.row &&
			position1.col === position2.col &&
			(position1.rowspan ?? 1) === (position2.rowspan ?? 1) &&
			(position1.colspan ?? 1) === (position2.colspan ?? 1)
		);
	}

	/**
	 * Retrieves the grid column width based on the specified media.
	 *
	 * @param media - The media value to determine the grid column width.
	 * @return The grid column width corresponding to the specified media.
	 */
	getGridColWidthByMedia(media: Media): number {
		switch (media) {
			case Media.Large:
				return GRID_COL_WIDTH_LARGE;
			case Media.Medium:
				return GRID_COL_WIDTH_MEDIUM;
			case Media.Small:
				return GRID_COL_WIDTH_SMALL;
		}
	}

	/**
	 * Gets the maximum number of rows occupied by components in a given form.
	 *
	 * @param {DynamicFormComposition} form - The form object for which to determine the maximum rows.
	 * @return {number} - The maximum number of rows occupied by components in the form.
	 */
	getMaxRows(form: DynamicFormComposition): number {
		if (form.components.length === 0) {
			return 0;
		}
		return Math.max(...form.components.map(c => c.position.row + (c.position.rowspan ?? 1) - 1));
	}

	setMedia(media: Media) {
		this.mediaSubject.next(media);
		this.gridChangedSubject.next(undefined);
	}

	private getLocalStorageKey(formName: string): string {
		return `${LOCAL_STORAGE_KEY_PREFIX}${formName}`;
	}

	private calculateSpanFinalPosition(
		initialPosition: DynamicFormComponentPosition,
		spanningCell: number,
		direction: GridDirection
	): DynamicFormComponentPosition {
		const finalPosition: DynamicFormComponentPosition = {...initialPosition};
		switch (direction) {
			case 'up':
				finalPosition.row -= spanningCell;
				finalPosition.rowspan = (finalPosition.rowspan ?? 1) + spanningCell;
				break;
			case 'down':
				finalPosition.rowspan = (finalPosition.rowspan ?? 1) + spanningCell;
				break;
			case 'left':
				finalPosition.col -= spanningCell;
				finalPosition.colspan = (finalPosition.colspan ?? 1) + spanningCell;
				break;
			case 'right':
				finalPosition.colspan = (finalPosition.colspan ?? 1) + spanningCell;
				break;
		}
		return finalPosition;
	}
}
