import { TestBed } from '@angular/core/testing';

import { TickTackToeServiceHostResolverService } from './tick-tack-toe-service-host-resolver.service';

describe('TickTackToeServiceHostResolverService', () => {
  let service: TickTackToeServiceHostResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickTackToeServiceHostResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
