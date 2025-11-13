import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteTipoNotaCreditoComponent } from './comprobante-tipo-nota-credito.component';

describe('ServicioComponent', () => {
  let component: ComprobanteTipoNotaCreditoComponent;
  let fixture: ComponentFixture<ComprobanteTipoNotaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteTipoNotaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteTipoNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
