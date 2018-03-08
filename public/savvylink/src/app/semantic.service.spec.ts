import { TestBed, inject } from '@angular/core/testing';

import { SemanticService } from './semantic.service';

describe('SemanticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SemanticService]
    });
  });

  it('should be created', inject([SemanticService], (service: SemanticService) => {
    expect(service).toBeTruthy();
  }));
});
