import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragZoneComponent } from './drag-zone.component';

describe('DragZoneComponent', () => {
  let component: DragZoneComponent;
  let fixture: ComponentFixture<DragZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragZoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
