import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasRangoComponent } from './ventas-rango.component';

describe('VentasRangoComponent', () => {
  let component: VentasRangoComponent;
  let fixture: ComponentFixture<VentasRangoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasRangoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasRangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
