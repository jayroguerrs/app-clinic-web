import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCambiarClaveComponent } from './usuario-cambiar-clave.component';

describe('UsuarioCambiarClaveComponent', () => {
  let component: UsuarioCambiarClaveComponent;
  let fixture: ComponentFixture<UsuarioCambiarClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCambiarClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCambiarClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
