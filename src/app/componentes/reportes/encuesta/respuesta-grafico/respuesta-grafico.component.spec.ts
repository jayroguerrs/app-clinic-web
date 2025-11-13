import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaGraficoComponent } from './respuesta-grafico.component';

describe('RespuestaGraficoComponent', () => {
  let component: RespuestaGraficoComponent;
  let fixture: ComponentFixture<RespuestaGraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestaGraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
