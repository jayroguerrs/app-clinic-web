import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CitaAsignacionComponent } from './cita-asignacion.component';
import { CitaAsignacionRoutingModule } from './cita-asignacion-routing.module';
import { CitaAsignacionOperadorComponent } from '../cita-asignacion-operador/cita-asignacion-operador.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {CitaAsignacionOperadorFiltroModule} from "../cita-asignacion-operador-filtro/cita-asignacion-operador-filtro.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { CardModule } from '../../../theme/shared/components';

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        CitaAsignacionRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatBottomSheetModule,
        CardModule,
        NgSelectModule,
        FontawesomeSvgModule,
        CitaAsignacionOperadorFiltroModule
    ],
    declarations: [
        CitaAsignacionComponent,
        CitaAsignacionOperadorComponent
    ]

})
export class CitaAsignacionModule {}
