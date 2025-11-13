import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenteObservacionComponent } from './preferente-observacion.component';

describe('PreferenteObservacionComponent', () => {
  let component: PreferenteObservacionComponent;
  let fixture: ComponentFixture<PreferenteObservacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenteObservacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenteObservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
