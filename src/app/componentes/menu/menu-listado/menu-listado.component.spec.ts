import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuListadoComponent } from './menu-listado.component';

describe('MenuListadoComponent', () => {
  let component: MenuListadoComponent;
  let fixture: ComponentFixture<MenuListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
