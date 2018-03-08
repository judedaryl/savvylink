import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationformComponent } from './organizationform.component';

describe('OrganizationformComponent', () => {
  let component: OrganizationformComponent;
  let fixture: ComponentFixture<OrganizationformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
