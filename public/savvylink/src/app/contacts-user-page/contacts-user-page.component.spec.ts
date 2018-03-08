import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsUserPageComponent } from './contacts-user-page.component';

describe('ContactsUserPageComponent', () => {
  let component: ContactsUserPageComponent;
  let fixture: ComponentFixture<ContactsUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
