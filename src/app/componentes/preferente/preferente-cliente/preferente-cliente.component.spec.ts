import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenteClienteComponent } from './preferente-cliente.component';

describe('PreferenteClienteComponent', () => {
  let component: PreferenteClienteComponent;
  let fixture: ComponentFixture<PreferenteClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenteClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenteClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
