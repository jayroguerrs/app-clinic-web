import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoReporteVentaComponent } from './comprobante-electronico-reporte-venta.component';

describe('ServicioComponent', () => {
  let component: ComprobanteElectronicoReporteVentaComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoReporteVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoReporteVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoReporteVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
