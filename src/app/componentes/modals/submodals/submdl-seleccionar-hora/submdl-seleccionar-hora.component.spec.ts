import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmdlSeleccionarHoraComponent } from './submdl-seleccionar-hora.component';

describe('ArticuloComponent', () => {
  let component: SubmdlSeleccionarHoraComponent;
  let fixture: ComponentFixture<SubmdlSeleccionarHoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmdlSeleccionarHoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmdlSeleccionarHoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
