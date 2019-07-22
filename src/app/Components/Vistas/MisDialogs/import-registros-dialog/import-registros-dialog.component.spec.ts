import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRegistrosDialogComponent } from './import-registros-dialog.component';

describe('ImportRegistrosDialogComponent', () => {
  let component: ImportRegistrosDialogComponent;
  let fixture: ComponentFixture<ImportRegistrosDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportRegistrosDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRegistrosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
