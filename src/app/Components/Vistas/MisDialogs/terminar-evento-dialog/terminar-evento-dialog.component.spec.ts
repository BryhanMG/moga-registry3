import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminarEventoDialogComponent } from './terminar-evento-dialog.component';

describe('TerminarEventoDialogComponent', () => {
  let component: TerminarEventoDialogComponent;
  let fixture: ComponentFixture<TerminarEventoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminarEventoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminarEventoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
