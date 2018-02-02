/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModelFbStorageService } from './model-fb-storage.service';

describe('ModelFbStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelFbStorageService]
    });
  });

  it('should ...', inject([ModelFbStorageService], (service: ModelFbStorageService) => {
    expect(service).toBeTruthy();
  }));
});
