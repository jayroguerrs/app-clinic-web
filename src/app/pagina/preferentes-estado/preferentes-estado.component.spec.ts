import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenteEstadoComponent } from './preferentes-estado.component';

describe('PreferenteEstadoComponent', () => {
  let component: PreferenteEstadoComponent;
  let fixture: ComponentFixture<PreferenteEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenteEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenteEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
