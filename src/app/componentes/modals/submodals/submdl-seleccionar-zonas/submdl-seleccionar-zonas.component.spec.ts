import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmdlSeleccionarZonasComponent } from './submdl-seleccionar-zonas.component';

describe('ArticuloComponent', () => {
  let component: SubmdlSeleccionarZonasComponent;
  let fixture: ComponentFixture<SubmdlSeleccionarZonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmdlSeleccionarZonasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmdlSeleccionarZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
