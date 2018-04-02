import { TestBed, inject } from '@angular/core/testing';

import { OrganizationdataService } from './organizationdata.service';

describe('OrganizationdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationdataService]
    });
  });

  it('should be created', inject([OrganizationdataService], (service: OrganizationdataService) => {
    expect(service).toBeTruthy();
  }));
});
