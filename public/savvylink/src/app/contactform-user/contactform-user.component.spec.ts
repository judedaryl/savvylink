import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactformUserComponent } from './contactform-user.component';

describe('ContactformUserComponent', () => {
  let component: ContactformUserComponent;
  let fixture: ComponentFixture<ContactformUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactformUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactformUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
