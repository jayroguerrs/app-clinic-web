import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../../theme/shared/shared.module";
import {FormsModule} from "@angular/forms";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import { MdlCitaAbandonadaEnEsperaAsignacionOperadorComponent } from './mdl-cita-abandonada-en-espera-asignacion-operador.component';

@NgModule({
  declarations: [MdlCitaAbandonadaEnEsperaAsignacionOperadorComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    NgbTooltipModule,
    NgxSpinnerModule,
  ],
  exports: [MdlCitaAbandonadaEnEsperaAsignacionOperadorComponent]
})
export class MdlCitaAbandonadaEnEsperaAsignacionOperadorModule { }
