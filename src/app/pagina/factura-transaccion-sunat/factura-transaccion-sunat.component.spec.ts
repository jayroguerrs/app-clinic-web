import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTransaccionSunatComponent } from './factura-transaccion-sunat.component';

describe('ServicioComponent', () => {
  let component: FacturaTransaccionSunatComponent;
  let fixture: ComponentFixture<FacturaTransaccionSunatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaTransaccionSunatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaTransaccionSunatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
