import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenteTablaComponent } from './preferente-tabla.component';

describe('PreferenteTablaComponent', () => {
  let component: PreferenteTablaComponent;
  let fixture: ComponentFixture<PreferenteTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenteTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenteTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
