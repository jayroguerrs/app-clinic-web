import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaHistoriasComponent } from './cita-historias.component';

describe('CitaHistoriasComponent', () => {
  let component: CitaHistoriasComponent;
  let fixture: ComponentFixture<CitaHistoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaHistoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaHistoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
