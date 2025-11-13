import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDialerComponent } from './input-dialer.component';

describe('GroupButtonComponent', () => {
  let component: InputDialerComponent;
  let fixture: ComponentFixture<InputDialerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputDialerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDialerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
