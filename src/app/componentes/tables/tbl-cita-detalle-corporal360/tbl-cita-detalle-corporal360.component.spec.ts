import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TblCitaDetalleCorporal360Component } from './tbl-cita-detalle-corporal360.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: TblCitaDetalleCorporal360Component;
  let fixture: ComponentFixture<TblCitaDetalleCorporal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TblCitaDetalleCorporal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TblCitaDetalleCorporal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
