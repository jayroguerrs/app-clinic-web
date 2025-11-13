import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {ReporteCitaAsignacionRoutingModule} from "./reporte-cita-asignacion-routing.module";
import {CitaAsignacionOperadorFiltroModule} from "../../cita/cita-asignacion-operador-filtro/cita-asignacion-operador-filtro.module";
import {ReporteCitaAsignacionComponent} from "./reporte-cita-asignacion.component";

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        ReporteCitaAsignacionRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatBottomSheetModule,

        FontawesomeSvgModule,
        CitaAsignacionOperadorFiltroModule
    ],
    declarations: [
        ReporteCitaAsignacionComponent
    ]

})
export class ReporteCitaAsignacionModule {}
