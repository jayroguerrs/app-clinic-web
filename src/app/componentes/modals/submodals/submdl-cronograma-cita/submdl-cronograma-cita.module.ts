import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatRippleModule} from '@angular/material/core';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {SubmdlCronogramaCitaComponent} from "./submdl-cronograma-cita.component";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {SubmdlSeleccionarHoraModule} from "../submdl-seleccionar-hora/submdl-seleccionar-hora.module";
import {CitaMensajeAvisoModule} from "../../../widgets/cita-mensaje-aviso/cita-mensaje-aviso.module";
import {CitaMensajeDetalleModule} from "../../../widgets/cita-mensaje-detalle/cita-mensaje-detalle.module";
import {TblCitaDetalleCorporal360Module} from "../../../tables/tbl-cita-detalle-corporal360/tbl-cita-detalle-corporal360.module";
import {CitaMensajeNotaModule} from "../../../widgets/cita-mensaje-nota/cita-mensaje-nota.module";
import {DisableControlModule} from "../../../../shared/directive/disable-control/disable-control.module";
import {MdlCitaEstadoModule} from "../../../../corporal360/componente/modal/mdl-cita-estado/mdl-cita-estado.module";
import {MdlCitaHistorialModule} from "../../../../corporal360/componente/modal/mdl-cita-historial/mdl-cita-historial.module";
import {CardCitaDetalleCorporal360Module} from "../../../../corporal360/componente/cards/card-cita-detalle-corporal360/card-cita-detalle-corporal360.module";
import {UsuarioSeleccionModule} from "../../../usuario/usuario-seleccion/usuario-seleccion.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";


@NgModule({
  declarations: [
    SubmdlCronogramaCitaComponent
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
    TblCitaDetalleCorporal360Module,
    DisableControlModule,
    NgbDropdownModule,
    MdlCitaEstadoModule,
    MdlCitaHistorialModule,
    CardCitaDetalleCorporal360Module,
    UsuarioSeleccionModule,
    MatProgressBarModule
  ],
  exports: [SubmdlCronogramaCitaComponent],
  providers: [],
  bootstrap: [SubmdlCronogramaCitaComponent]
})
export class SubmdlCronogramaCitaModule { }
