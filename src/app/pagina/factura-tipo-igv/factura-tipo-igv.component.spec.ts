import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTipoIgvComponent } from './factura-tipo-igv.component';

describe('ServicioComponent', () => {
  let component: FacturaTipoIgvComponent;
  let fixture: ComponentFixture<FacturaTipoIgvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaTipoIgvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaTipoIgvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
