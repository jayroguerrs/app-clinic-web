import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionHistoriasMasivasComponent } from './operacion-historias-masivas.component';

describe('TecnologiaComponent', () => {
  let component: OperacionHistoriasMasivasComponent;
  let fixture: ComponentFixture<OperacionHistoriasMasivasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperacionHistoriasMasivasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionHistoriasMasivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
