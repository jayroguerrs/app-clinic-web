import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisPotencialVentaComponent } from './analisis-potencial-venta.component';

describe('AnalisisPotencialVentaComponent', () => {
  let component: AnalisisPotencialVentaComponent;
  let fixture: ComponentFixture<AnalisisPotencialVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisPotencialVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisPotencialVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
