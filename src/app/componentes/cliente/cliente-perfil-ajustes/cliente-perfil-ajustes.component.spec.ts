import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilAjustesComponent } from './cliente-perfil-ajustes.component';

describe('ClientePerfilAjustesComponent', () => {
  let component: ClientePerfilAjustesComponent;
  let fixture: ComponentFixture<ClientePerfilAjustesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilAjustesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
