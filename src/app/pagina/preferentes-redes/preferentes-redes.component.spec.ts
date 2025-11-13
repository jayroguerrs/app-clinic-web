import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferentesRedesComponent } from './preferentes-redes.component';

describe('PreferentesRedesComponent', () => {
  let component: PreferentesRedesComponent;
  let fixture: ComponentFixture<PreferentesRedesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferentesRedesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferentesRedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
