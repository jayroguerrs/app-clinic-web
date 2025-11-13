import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteTipoNotaDebitoComponent } from './comprobante-tipo-nota-debito.component';

describe('ServicioComponent', () => {
  let component: ComprobanteTipoNotaDebitoComponent;
  let fixture: ComponentFixture<ComprobanteTipoNotaDebitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteTipoNotaDebitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteTipoNotaDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
