import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMensajeDetalleComponent } from './cita-mensaje-detalle.component';

describe('CitaMensajeDetalleComponent', () => {
  let component: CitaMensajeDetalleComponent;
  let fixture: ComponentFixture<CitaMensajeDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaMensajeDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaMensajeDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
