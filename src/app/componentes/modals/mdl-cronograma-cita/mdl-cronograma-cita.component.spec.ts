import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlCronogramaCitaComponent } from './mdl-cronograma-cita.component';

describe('ArticuloComponent', () => {
  let component: MdlCronogramaCitaComponent;
  let fixture: ComponentFixture<MdlCronogramaCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdlCronogramaCitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdlCronogramaCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
