import { TestBed, inject } from '@angular/core/testing';

import { OplService } from './opl.service';

describe('OplService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OplService]
    });
  });

  it('should be created', inject([OplService], (service: OplService) => {
    expect(service).toBeTruthy();
  }));
});
