import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmdlMaquinaSedeComponent } from './submdl-maquina-sede.component';

describe('ArticuloComponent', () => {
  let component: SubmdlMaquinaSedeComponent;
  let fixture: ComponentFixture<SubmdlMaquinaSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmdlMaquinaSedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmdlMaquinaSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
