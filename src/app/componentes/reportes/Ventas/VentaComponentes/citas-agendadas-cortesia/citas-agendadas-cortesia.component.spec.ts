import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasAgendadasCortesiaComponent } from './citas-agendadas-cortesia.component';

describe('VentasRangoComponent', () => {
  let component: CitasAgendadasCortesiaComponent;
  let fixture: ComponentFixture<CitasAgendadasCortesiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasAgendadasCortesiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasAgendadasCortesiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
