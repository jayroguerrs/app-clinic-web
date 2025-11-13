import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoReporteVentaProductoComponent } from './comprobante-electronico-reporte-venta-producto.component';

describe('ServicioComponent', () => {
  let component: ComprobanteElectronicoReporteVentaProductoComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoReporteVentaProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoReporteVentaProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoReporteVentaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
