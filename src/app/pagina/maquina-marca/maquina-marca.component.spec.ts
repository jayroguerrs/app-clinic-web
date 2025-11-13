import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinaMarcaComponent } from './maquina-marca.component';

describe('ServicioComponent', () => {
  let component: MaquinaMarcaComponent;
  let fixture: ComponentFixture<MaquinaMarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaquinaMarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinaMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
