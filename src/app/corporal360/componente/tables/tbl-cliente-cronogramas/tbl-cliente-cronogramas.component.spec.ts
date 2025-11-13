import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TblClienteCronogramasComponent } from './tbl-cliente-cronogramas.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: TblClienteCronogramasComponent;
  let fixture: ComponentFixture<TblClienteCronogramasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TblClienteCronogramasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TblClienteCronogramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
