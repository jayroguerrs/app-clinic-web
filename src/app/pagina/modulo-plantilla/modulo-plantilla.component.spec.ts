import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloPlantillaComponent } from './modulo-plantilla.component';

describe('ServicioComponent', () => {
  let component: ModuloPlantillaComponent;
  let fixture: ComponentFixture<ModuloPlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloPlantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
