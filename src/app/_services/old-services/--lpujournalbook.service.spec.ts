import { TestBed } from '@angular/core/testing';

import { LpujournalbookService } from './lpujournalbook.service';

describe('LpujournalbookService', () => {
  let service: LpujournalbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LpujournalbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
