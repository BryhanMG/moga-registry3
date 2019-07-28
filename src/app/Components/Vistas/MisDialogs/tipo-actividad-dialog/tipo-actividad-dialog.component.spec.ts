import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoActividadDialogComponent } from './tipo-actividad-dialog.component';

describe('TipoActividadDialogComponent', () => {
  let component: TipoActividadDialogComponent;
  let fixture: ComponentFixture<TipoActividadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoActividadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoActividadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
