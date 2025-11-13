import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoCajaComponent } from './seguimiento-caja.component';

describe('ServicioComponent', () => {
  let component: SeguimientoCajaComponent;
  let fixture: ComponentFixture<SeguimientoCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
