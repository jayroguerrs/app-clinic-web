import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilDatosgeneralesComponent } from './cliente-perfil-datosgenerales.component';

describe('ClientePerfilDatosgeneralesComponent', () => {
  let component: ClientePerfilDatosgeneralesComponent;
  let fixture: ComponentFixture<ClientePerfilDatosgeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilDatosgeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilDatosgeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
