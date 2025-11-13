import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaPorcentajeIgvComponent } from './factura-porcentaje-igv.component';

describe('ServicioComponent', () => {
  let component: FacturaPorcentajeIgvComponent;
  let fixture: ComponentFixture<FacturaPorcentajeIgvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaPorcentajeIgvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaPorcentajeIgvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
