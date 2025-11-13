import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarTopComponent } from './nav-bar-top.component';
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [NavBarTopComponent],
  imports: [
    CommonModule,
    MatRippleModule,
    FontawesomeSvgModule,
    NgbDropdownModule
  ],
  exports: [NavBarTopComponent],
  bootstrap: [NavBarTopComponent],
  providers: [NavBarTopComponent]
})

export class NavBarTopModule { }
