import { TestBed, inject } from '@angular/core/testing';

import { PotService } from './pot.service';

describe('PotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PotService]
    });
  });

  it('should be created', inject([PotService], (service: PotService) => {
    expect(service).toBeTruthy();
  }));
});
