import { TestBed } from '@angular/core/testing';

import { ByteSpotLibService } from './byte-spot-lib.service';

describe('ByteSpotLibService', () => {
  let service: ByteSpotLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByteSpotLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
