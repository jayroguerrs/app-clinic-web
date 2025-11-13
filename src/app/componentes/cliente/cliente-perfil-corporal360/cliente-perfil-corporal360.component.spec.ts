import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilCorporal360Component } from './cliente-perfil-corporal360.component';

describe('ClientePerfilCorporal360Component', () => {
  let component: ClientePerfilCorporal360Component;
  let fixture: ComponentFixture<ClientePerfilCorporal360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilCorporal360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilCorporal360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
