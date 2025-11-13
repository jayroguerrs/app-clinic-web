import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {CardCitaDetalleCorporal360Component} from "./card-cita-detalle-corporal360.component";
import {UsuarioSeleccionModule} from "../../../../componentes/usuario/usuario-seleccion/usuario-seleccion.module";
import {FontawesomeSvgModule} from "../../../../componentes/fontawesome-svg/fontawesome-svg.module";
import {NgxCurrencyModule} from "ngx-currency";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [CardCitaDetalleCorporal360Component],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    UsuarioSeleccionModule,
    NgxCurrencyModule,
    FormsModule
  ],
  exports: [CardCitaDetalleCorporal360Component],
  providers: [],
  bootstrap: [CardCitaDetalleCorporal360Component]
})
export class CardCitaDetalleCorporal360Module { }
