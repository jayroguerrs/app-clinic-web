import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteNotaCreditoComponent } from './comprobante-nota-credito.component';

describe('ServicioComponent', () => {
  let component: ComprobanteNotaCreditoComponent;
  let fixture: ComponentFixture<ComprobanteNotaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteNotaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
