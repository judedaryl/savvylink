import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListContributorComponent } from './contact-list-contributor.component';

describe('ContactListContributorComponent', () => {
  let component: ContactListContributorComponent;
  let fixture: ComponentFixture<ContactListContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
