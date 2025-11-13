import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaConfirmacionComponent } from './cita-confirmacion.component';

describe('CitaConfirmacionComponent', () => {
  let component: CitaConfirmacionComponent;
  let fixture: ComponentFixture<CitaConfirmacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaConfirmacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
