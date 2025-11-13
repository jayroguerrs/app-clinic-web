import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaTratamientoComponent } from './zona-tratamiento.component'

describe('TecnologiaComponent', () => {
  let component: ZonaTratamientoComponent;
  let fixture: ComponentFixture<ZonaTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
