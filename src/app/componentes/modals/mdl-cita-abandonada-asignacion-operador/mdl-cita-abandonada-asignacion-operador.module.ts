import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MdlCitaAbandonadaAsignacionOperadorComponent} from "./mdl-cita-abandonada-asignacion-operador.component";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../../theme/shared/shared.module";
import {FormsModule} from "@angular/forms";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";

@NgModule({
  declarations: [MdlCitaAbandonadaAsignacionOperadorComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    NgbTooltipModule,
    NgxSpinnerModule,
  ],
  exports: [MdlCitaAbandonadaAsignacionOperadorComponent]
})
export class MdlCitaAbandonadaAsignacionOperadorModule { }
