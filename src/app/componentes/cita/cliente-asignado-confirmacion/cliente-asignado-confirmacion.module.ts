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
import {CitaAsignacionOperadorFiltroModule} from "../cita-asignacion-operador-filtro/cita-asignacion-operador-filtro.module";
import {MdlClienteAsignarOperadorModule} from "../../modals/mdl-cliente-asignar-operador/mdl-cliente-asignar-operador.module";
import {MdlVerCitasClienteAsignadoTrabajarModule} from "../../modals/mdl-ver-citas-cliente-asignado-trabajar/mdl-ver-citas-cliente-asignado-trabajar.module";
import {ClienteAsignadoConfirmacionRoutingModule} from "./cliente-asignado-confirmacion-routing.module";
import {ClienteAsignadoConfirmacionComponent} from "./cliente-asignado-confirmacion.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClienteAsignadoConfirmacionRoutingModule,
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
        CitaAsignacionOperadorFiltroModule,
        MdlClienteAsignarOperadorModule,
        MdlVerCitasClienteAsignadoTrabajarModule
    ],
    declarations: [
        ClienteAsignadoConfirmacionComponent
    ]

})
export class ClienteAsignadoConfirmacionModule {}
