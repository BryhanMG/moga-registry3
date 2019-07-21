import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAdministradorDialogComponent } from './info-administrador-dialog.component';

describe('InfoAdministradorDialogComponent', () => {
  let component: InfoAdministradorDialogComponent;
  let fixture: ComponentFixture<InfoAdministradorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAdministradorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAdministradorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
