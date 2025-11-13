import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TblClienteFinanciamientoComponent } from './tbl-cliente-financiamiento.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: TblClienteFinanciamientoComponent;
  let fixture: ComponentFixture<TblClienteFinanciamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TblClienteFinanciamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TblClienteFinanciamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
