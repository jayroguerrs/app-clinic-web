import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTipoMonedaComponent } from './factura-tipo-moneda.component';

describe('ServicioComponent', () => {
  let component: FacturaTipoMonedaComponent;
  let fixture: ComponentFixture<FacturaTipoMonedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaTipoMonedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaTipoMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
