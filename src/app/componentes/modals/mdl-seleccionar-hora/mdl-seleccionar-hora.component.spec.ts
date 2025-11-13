import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlSeleccionarHoraComponent } from './mdl-seleccionar-hora.component';

describe('ArticuloComponent', () => {
  let component: MdlSeleccionarHoraComponent;
  let fixture: ComponentFixture<MdlSeleccionarHoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdlSeleccionarHoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdlSeleccionarHoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
