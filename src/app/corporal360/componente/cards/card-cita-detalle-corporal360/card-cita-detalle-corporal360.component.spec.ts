import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCitaDetalleCorporal360Component } from './card-cita-detalle-corporal360.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: CardCitaDetalleCorporal360Component;
  let fixture: ComponentFixture<CardCitaDetalleCorporal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardCitaDetalleCorporal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCitaDetalleCorporal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
