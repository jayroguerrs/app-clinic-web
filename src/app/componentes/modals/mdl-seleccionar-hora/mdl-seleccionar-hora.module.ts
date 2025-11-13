import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {GroupButtonModule} from "../../group-button/group-button.module";
import {MdlSeleccionarHoraComponent} from "./mdl-seleccionar-hora.component";
import {InputDialerModule} from "../../input-dialer/input-dialer.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";


@NgModule({
  declarations: [
    MdlSeleccionarHoraComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    GroupButtonModule,
    InputDialerModule,
    FontawesomeSvgModule
  ],
  exports: [MdlSeleccionarHoraComponent],
  providers: [],
  bootstrap: [MdlSeleccionarHoraComponent]
})
export class MdlSeleccionarHoraModule { }
