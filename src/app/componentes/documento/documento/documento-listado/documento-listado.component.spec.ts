import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoListadoComponent } from './documento-listado.component';

describe('DocumentoListadoComponent', () => {
  let component: DocumentoListadoComponent;
  let fixture: ComponentFixture<DocumentoListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
