import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFormRendererComponent } from './ngx-form-renderer.component';

describe('NgxFormRendererComponent', () => {
  let component: NgxFormRendererComponent;
  let fixture: ComponentFixture<NgxFormRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFormRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFormRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
