import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {SubmdlSeleccionarHoraComponent} from "./submdl-seleccionar-hora.component";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {SubmdlSeleccionarTecnologiasModule} from "../submdl-seleccionar-tecnologias/submdl-seleccionar-tecnologias.module";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
  declarations: [
    SubmdlSeleccionarHoraComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    FontawesomeSvgModule,
    SubmdlSeleccionarTecnologiasModule,
    FlatpickrModule,
    FormsModule
  ],
  exports: [SubmdlSeleccionarHoraComponent],
  providers: [],
  bootstrap: [SubmdlSeleccionarHoraComponent]
})
export class SubmdlSeleccionarHoraModule { }
