import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoReporteVentaClienteComponent } from './comprobante-electronico-reporte-venta-cliente.component';

describe('ServicioComponent', () => {
  let component: ComprobanteElectronicoReporteVentaClienteComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoReporteVentaClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoReporteVentaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoReporteVentaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
