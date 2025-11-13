import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTipoDocumentoComponent } from './factura-tipo-documento.component';

describe('ServicioComponent', () => {
  let component: FacturaTipoDocumentoComponent;
  let fixture: ComponentFixture<FacturaTipoDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaTipoDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
