import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationspageComponent } from './organizationspage.component';

describe('OrganizationspageComponent', () => {
  let component: OrganizationspageComponent;
  let fixture: ComponentFixture<OrganizationspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
