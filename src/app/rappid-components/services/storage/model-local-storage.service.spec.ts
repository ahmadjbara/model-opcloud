/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModelLocalStorageService } from './model-local-storage.service';

describe('ModelLocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelLocalStorageService]
    });
  });

  it('should ...', inject([ModelLocalStorageService], (service: ModelLocalStorageService) => {
    expect(service).toBeTruthy();
  }));
});
