import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndGridComponent } from './dnd-grid.component';

describe('DndGridComponent', () => {
  let component: DndGridComponent;
  let fixture: ComponentFixture<DndGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DndGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DndGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
