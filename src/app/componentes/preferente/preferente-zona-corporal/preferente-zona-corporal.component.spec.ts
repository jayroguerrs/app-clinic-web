import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenteZonaCorporalComponent } from './preferente-zona-corporal.component';

describe('PreferenteZonaCorporalComponent', () => {
  let component: PreferenteZonaCorporalComponent;
  let fixture: ComponentFixture<PreferenteZonaCorporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenteZonaCorporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenteZonaCorporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
