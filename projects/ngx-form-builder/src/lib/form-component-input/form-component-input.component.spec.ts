import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormComponentInputComponent} from './form-component-input.component';

describe('FormComponentInputComponent', () => {
	let component: FormComponentInputComponent;
	let fixture: ComponentFixture<FormComponentInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormComponentInputComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FormComponentInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
