import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarUsuarioDialogComponent } from './eliminar-usuario-dialog.component';

describe('EliminarUsuarioDialogComponent', () => {
  let component: EliminarUsuarioDialogComponent;
  let fixture: ComponentFixture<EliminarUsuarioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarUsuarioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
