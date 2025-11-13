import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteElectronicoListadoComponent } from './comprobante-electronico-listado.component';

describe('ServicioComponent', () => {
  let component: ComprobanteElectronicoListadoComponent;
  let fixture: ComponentFixture<ComprobanteElectronicoListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteElectronicoListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteElectronicoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
