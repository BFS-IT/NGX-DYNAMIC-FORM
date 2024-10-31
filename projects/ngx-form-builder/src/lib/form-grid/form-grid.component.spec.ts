import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormGridComponent} from './form-grid.component';

describe('FormBuilderGridComponent', () => {
	let component: FormGridComponent;
	let fixture: ComponentFixture<FormGridComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormGridComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FormGridComponent);
		component = fixture.componentInstance as FormGridComponent;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
