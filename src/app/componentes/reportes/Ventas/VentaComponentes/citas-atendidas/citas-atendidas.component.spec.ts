import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasAtendidasComponent } from './citas-atendidas.component';

describe('VentasRangoComponent', () => {
  let component: CitasAtendidasComponent;
  let fixture: ComponentFixture<CitasAtendidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasAtendidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasAtendidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
