import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaCuadreComponent } from './caja-cuadre.component';

describe('CajaCuadreComponent', () => {
  let component: CajaCuadreComponent;
  let fixture: ComponentFixture<CajaCuadreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaCuadreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaCuadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
