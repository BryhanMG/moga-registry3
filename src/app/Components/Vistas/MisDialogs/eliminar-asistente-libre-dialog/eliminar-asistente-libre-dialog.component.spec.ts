import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarAsistenteLibreDialogComponent } from './eliminar-asistente-libre-dialog.component';

describe('EliminarAsistenteLibreDialogComponent', () => {
  let component: EliminarAsistenteLibreDialogComponent;
  let fixture: ComponentFixture<EliminarAsistenteLibreDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarAsistenteLibreDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarAsistenteLibreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
