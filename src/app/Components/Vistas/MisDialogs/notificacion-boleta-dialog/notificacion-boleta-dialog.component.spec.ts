import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionBoletaDialogComponent } from './notificacion-boleta-dialog.component';

describe('NotificacionBoletaDialogComponent', () => {
  let component: NotificacionBoletaDialogComponent;
  let fixture: ComponentFixture<NotificacionBoletaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionBoletaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionBoletaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
