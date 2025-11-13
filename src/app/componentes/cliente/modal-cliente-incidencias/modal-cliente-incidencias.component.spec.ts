import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClienteIncidenciasComponent } from './modal-cliente-incidencias.component';

describe('ModalClienteIncidenciasComponent', () => {
  let component: ModalClienteIncidenciasComponent;
  let fixture: ComponentFixture<ModalClienteIncidenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalClienteIncidenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClienteIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
