import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaTablaComponent } from './respuesta-tabla.component';

describe('RespuestaTablaComponent', () => {
  let component: RespuestaTablaComponent;
  let fixture: ComponentFixture<RespuestaTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestaTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
