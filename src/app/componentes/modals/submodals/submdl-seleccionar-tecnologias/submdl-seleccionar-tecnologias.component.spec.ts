import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmdlSeleccionarTecnologiasComponent } from './submdl-seleccionar-tecnologias.component';

describe('ArticuloComponent', () => {
  let component: SubmdlSeleccionarTecnologiasComponent;
  let fixture: ComponentFixture<SubmdlSeleccionarTecnologiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmdlSeleccionarTecnologiasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmdlSeleccionarTecnologiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
