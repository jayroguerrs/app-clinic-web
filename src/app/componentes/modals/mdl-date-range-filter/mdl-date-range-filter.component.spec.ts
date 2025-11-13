import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlDateRangeFilterComponent } from './mdl-date-range-filter.component';

describe('MdlDateRangeFilterComponent', () => {
  let component: MdlDateRangeFilterComponent;
  let fixture: ComponentFixture<MdlDateRangeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdlDateRangeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdlDateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
