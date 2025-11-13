import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilRejuvenecimientoFacialComponent } from './cliente-perfil-rejuvenecimiento-facial.component';

describe('ClientePerfilCorporal360Component', () => {
  let component: ClientePerfilRejuvenecimientoFacialComponent;
  let fixture: ComponentFixture<ClientePerfilRejuvenecimientoFacialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilRejuvenecimientoFacialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilRejuvenecimientoFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
