import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlPdfGoogleViewComponent } from './mdl-pdf-google-view.component';

describe('ArticuloComponent', () => {
  let component: MdlPdfGoogleViewComponent;
  let fixture: ComponentFixture<MdlPdfGoogleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdlPdfGoogleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdlPdfGoogleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
