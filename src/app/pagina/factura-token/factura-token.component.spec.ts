import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTokenComponent } from './factura-token.component';

describe('ServicioComponent', () => {
  let component: FacturaTokenComponent;
  let fixture: ComponentFixture<FacturaTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
