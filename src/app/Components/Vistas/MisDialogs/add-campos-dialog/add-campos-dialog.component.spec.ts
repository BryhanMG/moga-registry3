import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCamposDialogComponent } from './add-campos-dialog.component';

describe('AddCamposDialogComponent', () => {
  let component: AddCamposDialogComponent;
  let fixture: ComponentFixture<AddCamposDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCamposDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCamposDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
