import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderCircleComponent } from './loader-circle.component';

describe('HistoryComponent', () => {
  let component: LoaderCircleComponent;
  let fixture: ComponentFixture<LoaderCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
