import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilTratamientoFacialComponent } from './cliente-perfil-tratamiento-facial.component';

describe('ClientePerfilCorporal360Component', () => {
  let component: ClientePerfilTratamientoFacialComponent;
  let fixture: ComponentFixture<ClientePerfilTratamientoFacialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilTratamientoFacialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilTratamientoFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
