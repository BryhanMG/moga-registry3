import { TestBed } from '@angular/core/testing';

import { RelojService } from './reloj.service';

describe('RelojService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelojService = TestBed.get(RelojService);
    expect(service).toBeTruthy();
  });
});
