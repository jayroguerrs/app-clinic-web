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
import {ClienteAsignacionComponent} from "./cliente-asignacion.component";
import {ClienteAsignacionRoutingModule} from "./cliente-asignacion-routing.module";
import {MdlClienteAsignarOperadorModule} from "../../modals/mdl-cliente-asignar-operador/mdl-cliente-asignar-operador.module";
import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select';
import {MdlVerCitasClienteAsignadoModule} from "../../modals/mdl-ver-citas-cliente-asignado/mdl-ver-citas-cliente-asignado.module";
import {MdlClienteReasignarOperadorModule} from "../../modals/mdl-cliente-reasignar-operador/mdl-cliente-reasignar-operador.module";
import {MdlClienteAsignadoHistorialModule} from "../../modals/mdl-cliente-asignado-historial/mdl-cliente-asignado-historial.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClienteAsignacionRoutingModule,
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
        MdlClienteReasignarOperadorModule,
        MdlVerCitasClienteAsignadoModule,
        MdlClienteAsignadoHistorialModule,
        AutocompleteSelectModule
    ],
    declarations: [
        ClienteAsignacionComponent
    ]

})
export class ClienteAsignacionModule {}
