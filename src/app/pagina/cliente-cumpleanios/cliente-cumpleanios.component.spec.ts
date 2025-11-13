import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCumpleaniosComponent } from './cliente-cumpleanios.component';

describe('ClienteCumpleaniosComponent', () => {
  let component: ClienteCumpleaniosComponent;
  let fixture: ComponentFixture<ClienteCumpleaniosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteCumpleaniosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteCumpleaniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
