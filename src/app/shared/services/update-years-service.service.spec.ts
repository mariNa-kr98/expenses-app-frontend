import { TestBed } from '@angular/core/testing';

import { UpdateYearsServiceService } from './update-years-service.service';

describe('UpdateYearsServiceService', () => {
  let service: UpdateYearsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateYearsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
