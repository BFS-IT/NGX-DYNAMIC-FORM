import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderToolsComponent } from './form-builder-tools.component';

describe('FormBuilderToolsComponent', () => {
	let component: FormBuilderToolsComponent;
	let fixture: ComponentFixture<FormBuilderToolsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormBuilderToolsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(FormBuilderToolsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
