import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministarUsuariosComponent } from './administar-usuarios.component';

describe('AdministarUsuariosComponent', () => {
  let component: AdministarUsuariosComponent;
  let fixture: ComponentFixture<AdministarUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministarUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
