import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarAdminDialogComponent } from './eliminar-admin-dialog.component';

describe('EliminarAdminDialogComponent', () => {
  let component: EliminarAdminDialogComponent;
  let fixture: ComponentFixture<EliminarAdminDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarAdminDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
