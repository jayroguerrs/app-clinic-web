import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasAbandonadasConfirmacionComponent } from './citas-abandonadas-confirmacion.component';

describe('CitaConfirmacionComponent', () => {
  let component: CitasAbandonadasConfirmacionComponent;
  let fixture: ComponentFixture<CitasAbandonadasConfirmacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasAbandonadasConfirmacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasAbandonadasConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
