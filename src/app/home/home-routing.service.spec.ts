import { TestBed } from '@angular/core/testing';

import { HomeRoutingService } from './home-routing.service';

describe('HomeRoutingService', () => {
  let service: HomeRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
