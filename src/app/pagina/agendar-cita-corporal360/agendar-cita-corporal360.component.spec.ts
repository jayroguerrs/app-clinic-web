import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarCitaCorporal360Component } from './agendar-cita-corporal360.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: AgendarCitaCorporal360Component;
  let fixture: ComponentFixture<AgendarCitaCorporal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendarCitaCorporal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarCitaCorporal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
