import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPagoComponent } from './registro-pago.component';

describe('RegistroPagoComponent', () => {
  let component: RegistroPagoComponent;
  let fixture: ComponentFixture<RegistroPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
