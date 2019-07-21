import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLogoutComponent } from './error-logout.component';

describe('ErrorLogoutComponent', () => {
  let component: ErrorLogoutComponent;
  let fixture: ComponentFixture<ErrorLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
