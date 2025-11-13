import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaDetalleComponent } from './cita-detalle.component';

describe('CitaMensajeDetalleComponent', () => {
  let component: CitaDetalleComponent;
  let fixture: ComponentFixture<CitaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
