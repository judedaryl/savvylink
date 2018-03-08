import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAddonComponent } from './login-addon.component';

describe('LoginAddonComponent', () => {
  let component: LoginAddonComponent;
  let fixture: ComponentFixture<LoginAddonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAddonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
