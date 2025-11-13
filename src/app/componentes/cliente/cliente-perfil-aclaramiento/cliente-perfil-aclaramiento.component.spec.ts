import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilAclaramientoComponent } from './cliente-perfil-aclaramiento.component';

describe('ClientePerfilAclaramientoComponent', () => {
  let component: ClientePerfilAclaramientoComponent;
  let fixture: ComponentFixture<ClientePerfilAclaramientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilAclaramientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilAclaramientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
