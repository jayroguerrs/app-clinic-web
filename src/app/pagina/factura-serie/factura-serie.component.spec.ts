import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaSerieComponent } from './factura-serie.component';

describe('ServicioComponent', () => {
  let component: FacturaSerieComponent;
  let fixture: ComponentFixture<FacturaSerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaSerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
