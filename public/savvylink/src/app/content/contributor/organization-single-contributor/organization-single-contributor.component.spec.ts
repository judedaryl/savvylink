import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSingleContributorComponent } from './organization-single-contributor.component';

describe('OrganizationSingleContributorComponent', () => {
  let component: OrganizationSingleContributorComponent;
  let fixture: ComponentFixture<OrganizationSingleContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationSingleContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSingleContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
