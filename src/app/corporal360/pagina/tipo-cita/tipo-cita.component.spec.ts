import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCitaComponent } from './tipo-cita.component';

describe('CasoComponent', () => {
  let component: TipoCitaComponent;
  let fixture: ComponentFixture<TipoCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoCitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
