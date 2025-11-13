import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteUnidadMedidaComponent } from './comprobante-unidad-medida.component';

describe('ServicioComponent', () => {
  let component: ComprobanteUnidadMedidaComponent;
  let fixture: ComponentFixture<ComprobanteUnidadMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteUnidadMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteUnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
