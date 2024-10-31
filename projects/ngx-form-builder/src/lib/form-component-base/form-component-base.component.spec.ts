import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormComponentBaseComponent} from './form-component-base.component';

describe('FormComponentBaseComponent', () => {
	let component: FormComponentBaseComponent;
	let fixture: ComponentFixture<FormComponentBaseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormComponentBaseComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(FormComponentBaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
