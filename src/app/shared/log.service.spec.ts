import { TestBed } from '@angular/core/testing';

import { LogService } from '../shared/log.service';

describe('LogServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogService = TestBed.get(LogService);
    expect(service).toBeTruthy();
  });
});
