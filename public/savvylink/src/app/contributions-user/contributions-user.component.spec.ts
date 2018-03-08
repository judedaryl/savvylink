import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionsUserComponent } from './contributions-user.component';

describe('ContributionsUserComponent', () => {
  let component: ContributionsUserComponent;
  let fixture: ComponentFixture<ContributionsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributionsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
