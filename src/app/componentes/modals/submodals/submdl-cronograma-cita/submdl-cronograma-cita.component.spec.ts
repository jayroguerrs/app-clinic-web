import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmdlCronogramaCitaComponent } from './submdl-cronograma-cita.component';

describe('ArticuloComponent', () => {
  let component: SubmdlCronogramaCitaComponent;
  let fixture: ComponentFixture<SubmdlCronogramaCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmdlCronogramaCitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmdlCronogramaCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
