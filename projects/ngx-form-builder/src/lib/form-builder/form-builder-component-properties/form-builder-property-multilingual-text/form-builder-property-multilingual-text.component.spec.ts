import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormBuilderPropertyMultilingualTextComponent} from './form-builder-property-multilingual-text.component';

describe('FormBuilderPropertyMultilingualTextComponent', () => {
	let component: FormBuilderPropertyMultilingualTextComponent;
	let fixture: ComponentFixture<FormBuilderPropertyMultilingualTextComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormBuilderPropertyMultilingualTextComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(FormBuilderPropertyMultilingualTextComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
