import { TestBed } from '@angular/core/testing';

import { ComponentGeneratorService } from './component-generator.service';

describe('ComponentGeneratorService', () => {
  let service: ComponentGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
