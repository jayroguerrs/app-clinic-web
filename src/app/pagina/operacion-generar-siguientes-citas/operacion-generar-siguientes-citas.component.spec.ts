import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionGenerarSiguientesCitasComponent } from './operacion-generar-siguientes-citas.component';

describe('TecnologiaComponent', () => {
  let component: OperacionGenerarSiguientesCitasComponent;
  let fixture: ComponentFixture<OperacionGenerarSiguientesCitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperacionGenerarSiguientesCitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionGenerarSiguientesCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
