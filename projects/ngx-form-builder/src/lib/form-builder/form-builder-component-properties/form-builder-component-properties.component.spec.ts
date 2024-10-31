import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderComponentPropertiesComponent } from './form-builder-component-properties.component';

describe('FormBuilderComponentPropertiesComponent', () => {
	let component: FormBuilderComponentPropertiesComponent;
	let fixture: ComponentFixture<FormBuilderComponentPropertiesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormBuilderComponentPropertiesComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(FormBuilderComponentPropertiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
