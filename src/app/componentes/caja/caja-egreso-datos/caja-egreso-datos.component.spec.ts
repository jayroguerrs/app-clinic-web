import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaEgresoDatosComponent } from './caja-egreso-datos.component';

describe('CajaEgresoDatosComponent', () => {
  let component: CajaEgresoDatosComponent;
  let fixture: ComponentFixture<CajaEgresoDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaEgresoDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaEgresoDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
