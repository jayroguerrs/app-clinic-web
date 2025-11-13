import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteSerieComponent } from './comprobante-serie.component';

describe('ServicioComponent', () => {
  let component: ComprobanteSerieComponent;
  let fixture: ComponentFixture<ComprobanteSerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteSerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
