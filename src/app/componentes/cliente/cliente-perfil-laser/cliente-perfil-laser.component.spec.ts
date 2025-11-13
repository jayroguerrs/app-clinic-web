import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilLaserComponent } from './cliente-perfil-laser.component';

describe('ClientePerfilLaserComponent', () => {
  let component: ClientePerfilLaserComponent;
  let fixture: ComponentFixture<ClientePerfilLaserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientePerfilLaserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilLaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
