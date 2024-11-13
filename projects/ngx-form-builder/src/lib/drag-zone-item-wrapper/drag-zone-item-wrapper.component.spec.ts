import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragZoneItemWrapperComponent } from './drag-zone-item-wrapper.component';

describe('DragpanelWrapperComponent', () => {
  let component: DragZoneItemWrapperComponent;
  let fixture: ComponentFixture<DragZoneItemWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragZoneItemWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragZoneItemWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
