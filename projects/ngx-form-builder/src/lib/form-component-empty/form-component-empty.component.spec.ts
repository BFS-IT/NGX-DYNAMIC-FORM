import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormComponentEmptyComponent} from './form-component-empty.component';

describe('FormComponentEmptyComponent', () => {
	let component: FormComponentEmptyComponent;
	let fixture: ComponentFixture<FormComponentEmptyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormComponentEmptyComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FormComponentEmptyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
