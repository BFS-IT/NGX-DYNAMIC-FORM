import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormComponentTextComponent} from './form-component-text.component';

describe('FormComponentLabelComponent', () => {
	let component: FormComponentTextComponent;
	let fixture: ComponentFixture<FormComponentTextComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormComponentTextComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FormComponentTextComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
