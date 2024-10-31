import { TestBed } from '@angular/core/testing';

import { NgxFormRendererService } from './ngx-form-renderer.service';

describe('NgxFormRendererService', () => {
  let service: NgxFormRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFormRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
