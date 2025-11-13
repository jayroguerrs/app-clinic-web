import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoReportePagoComponent } from './comprobante-electronico-reporte-pago.component';

describe('ServicioComponent', () => {
  let component: ComprobanteElectronicoReportePagoComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoReportePagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoReportePagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoReportePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
