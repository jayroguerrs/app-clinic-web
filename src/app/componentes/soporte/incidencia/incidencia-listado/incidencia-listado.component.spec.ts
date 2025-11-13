import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaListadoComponent } from './incidencia-listado.component';

describe('IncidenciaListadoComponent', () => {
  let component: IncidenciaListadoComponent;
  let fixture: ComponentFixture<IncidenciaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
