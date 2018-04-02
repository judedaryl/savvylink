import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationListContributorComponent } from './organization-list-contributor.component';

describe('OrganizationListContributorComponent', () => {
  let component: OrganizationListContributorComponent;
  let fixture: ComponentFixture<OrganizationListContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationListContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationListContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
