import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaTablaComponent } from './incidencia-tabla.component';

describe('IncidenciaTablaComponent', () => {
  let component: IncidenciaTablaComponent;
  let fixture: ComponentFixture<IncidenciaTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciaTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
