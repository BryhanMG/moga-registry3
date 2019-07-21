import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenticacionPagoComponent } from './autenticacion-pago.component';

describe('AutenticacionPagoComponent', () => {
  let component: AutenticacionPagoComponent;
  let fixture: ComponentFixture<AutenticacionPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutenticacionPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutenticacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
