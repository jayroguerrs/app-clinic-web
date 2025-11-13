import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top10ZonasAtendidasComponent } from './top10-zonas-atendidas.component';

describe('Top10ZonasAtendidasComponent', () => {
  let component: Top10ZonasAtendidasComponent;
  let fixture: ComponentFixture<Top10ZonasAtendidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top10ZonasAtendidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top10ZonasAtendidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
