import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontawesomeSvgComponent } from './fontawesome-svg.component';

describe('SpinnerComponent', () => {
  let component: FontawesomeSvgComponent;
  let fixture: ComponentFixture<FontawesomeSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontawesomeSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontawesomeSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
