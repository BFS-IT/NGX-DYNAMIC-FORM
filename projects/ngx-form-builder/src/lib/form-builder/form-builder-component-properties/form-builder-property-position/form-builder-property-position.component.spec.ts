import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormBuilderPropertyPositionComponent} from './form-builder-property-position.component';

describe('FormBuilderPropertyPositionComponent', () => {
	let component: FormBuilderPropertyPositionComponent;
	let fixture: ComponentFixture<FormBuilderPropertyPositionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormBuilderPropertyPositionComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FormBuilderPropertyPositionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
