import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteGenerarCitaComponent } from './cliente-generar-cita.component';

describe('ClienteGenerarCitaComponent', () => {
  let component: ClienteGenerarCitaComponent;
  let fixture: ComponentFixture<ClienteGenerarCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteGenerarCitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteGenerarCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
