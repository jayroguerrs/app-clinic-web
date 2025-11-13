import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {CitasAbandonadasAsignacionComponent} from "./citas-abandonadas-asignacion.component";
import {CitasAbandonadasAsignacionRoutingModule} from "./citas-abandonadas-asignacion-routing.module";
import {SharedModule} from "../../theme/shared/shared.module";
import {MdlCitaAbandonadaAsignacionOperadorModule} from "../../componentes/modals/mdl-cita-abandonada-asignacion-operador/mdl-cita-abandonada-asignacion-operador.module";
import {MdlCitaAbandonadaEnEsperaAsignacionOperadorModule} from "../../componentes/modals/mdl-cita-abandonada-en espera-asignacion-operador/mdl-cita-abandonada-en-espera-asignacion-operador.module";

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        CitasAbandonadasAsignacionRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatBottomSheetModule,

        MdlCitaAbandonadaAsignacionOperadorModule,
        MdlCitaAbandonadaEnEsperaAsignacionOperadorModule,
    ],
    declarations: [
        CitasAbandonadasAsignacionComponent
    ]
})
export class CitasAbandonadasAsignacionModule {}
