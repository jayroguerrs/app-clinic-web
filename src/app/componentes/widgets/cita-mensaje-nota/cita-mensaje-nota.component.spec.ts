import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMensajeNotaComponent } from './cita-mensaje-nota.component';

describe('CitaMensajeNotaComponent', () => {
  let component: CitaMensajeNotaComponent;
  let fixture: ComponentFixture<CitaMensajeNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaMensajeNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaMensajeNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
