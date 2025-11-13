import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlCronogramaCitaComponent} from "./mdl-cronograma-cita.component";
import {SubmdlSeleccionarHoraModule} from "../submodals/submdl-seleccionar-hora/submdl-seleccionar-hora.module";
import {CitaMensajeAvisoModule} from "../../widgets/cita-mensaje-aviso/cita-mensaje-aviso.module";
import {CitaMensajeDetalleModule} from "../../widgets/cita-mensaje-detalle/cita-mensaje-detalle.module";
import {CitaMensajeNotaModule} from "../../widgets/cita-mensaje-nota/cita-mensaje-nota.module";
import {
  TblCitaDetalleCorporal360Module
} from "../../tables/tbl-cita-detalle-corporal360/tbl-cita-detalle-corporal360.module";


@NgModule({
  declarations: [
    MdlCronogramaCitaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    FontawesomeSvgModule,
    SubmdlSeleccionarHoraModule,
    CitaMensajeAvisoModule,
    CitaMensajeDetalleModule,
    CitaMensajeNotaModule,
    TblCitaDetalleCorporal360Module
  ],
  exports: [MdlCronogramaCitaComponent],
  providers: [],
  bootstrap: [MdlCronogramaCitaComponent]
})
export class MdlCronogramaCitaModule { }
