import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarCronogramaCorporal360Component } from './agendar-cronograma-corporal360.component';

describe('AgendarCitaCorporal360Component', () => {
  let component: AgendarCronogramaCorporal360Component;
  let fixture: ComponentFixture<AgendarCronogramaCorporal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendarCronogramaCorporal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarCronogramaCorporal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
