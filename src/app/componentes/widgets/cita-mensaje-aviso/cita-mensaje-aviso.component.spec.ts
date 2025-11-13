import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMensajeAvisoComponent } from './cita-mensaje-aviso.component';

describe('CitaMensajeAvisoComponent', () => {
  let component: CitaMensajeAvisoComponent;
  let fixture: ComponentFixture<CitaMensajeAvisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaMensajeAvisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaMensajeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
