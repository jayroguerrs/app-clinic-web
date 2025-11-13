import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaDatosComponent } from './incidencia-datos.component';

describe('IncidenciaDatosComponent', () => {
  let component: IncidenciaDatosComponent;
  let fixture: ComponentFixture<IncidenciaDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciaDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
