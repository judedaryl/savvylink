import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsUserComponent } from './organizations-user.component';

describe('OrganizationsUserComponent', () => {
  let component: OrganizationsUserComponent;
  let fixture: ComponentFixture<OrganizationsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
