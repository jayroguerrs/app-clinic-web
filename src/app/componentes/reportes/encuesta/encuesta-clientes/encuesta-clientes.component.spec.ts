import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaClientesComponent } from './encuesta-clientes.component';

describe('EncuestaClientesComponent', () => {
  let component: EncuestaClientesComponent;
  let fixture: ComponentFixture<EncuestaClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
