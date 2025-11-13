import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoAnulacionComponent } from './comprobante-electronico-anulacion.component';

describe('ServicioComponent', () => {
  let component: ComprobanteElectronicoAnulacionComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoAnulacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoAnulacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
