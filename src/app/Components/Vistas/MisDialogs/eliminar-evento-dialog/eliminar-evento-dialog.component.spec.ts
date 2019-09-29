import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEventoDialogComponent } from './eliminar-evento-dialog.component';

describe('EliminarEventoDialogComponent', () => {
  let component: EliminarEventoDialogComponent;
  let fixture: ComponentFixture<EliminarEventoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarEventoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarEventoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
