import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaCorporalSeleccionarComponent } from './zona-corporal-seleccionar.component';

describe('ZonaCorporalSeleccionarComponent', () => {
  let component: ZonaCorporalSeleccionarComponent;
  let fixture: ComponentFixture<ZonaCorporalSeleccionarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaCorporalSeleccionarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaCorporalSeleccionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
