import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucionCitaMensualComponent } from './evolucion-cita-mensual.component';

describe('EvolucionCitaMensualComponent', () => {
  let component: EvolucionCitaMensualComponent;
  let fixture: ComponentFixture<EvolucionCitaMensualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvolucionCitaMensualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucionCitaMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
