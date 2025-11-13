import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaModalComponent } from './incidencia-modal.component';

describe('IncidenciaModalComponent', () => {
  let component: IncidenciaModalComponent;
  let fixture: ComponentFixture<IncidenciaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
