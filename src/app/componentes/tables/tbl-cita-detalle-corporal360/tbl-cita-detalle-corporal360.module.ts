import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {TblCitaDetalleCorporal360Component} from "./tbl-cita-detalle-corporal360.component";
import {UsuarioSeleccionModule} from "../../usuario/usuario-seleccion/usuario-seleccion.module";


@NgModule({
  declarations: [TblCitaDetalleCorporal360Component],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    UsuarioSeleccionModule
  ],
  exports: [TblCitaDetalleCorporal360Component],
  providers: [],
  bootstrap: [TblCitaDetalleCorporal360Component]
})
export class TblCitaDetalleCorporal360Module { }
