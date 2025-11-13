import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TblCronogramaCorporal360Component } from './tbl-cronograma-corporal360.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: TblCronogramaCorporal360Component;
  let fixture: ComponentFixture<TblCronogramaCorporal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TblCronogramaCorporal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TblCronogramaCorporal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
