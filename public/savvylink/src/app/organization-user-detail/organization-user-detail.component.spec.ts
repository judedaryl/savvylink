import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationUserDetailComponent } from './organization-user-detail.component';

describe('OrganizationUserDetailComponent', () => {
  let component: OrganizationUserDetailComponent;
  let fixture: ComponentFixture<OrganizationUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
