import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { MaquinaSedeRoutingModule } from './maquina-sede-routing.module';
import { MaquinaSedeListadoComponent } from './maquina-sede-listado/maquina-sede-listado.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MaquinaSedeDatosComponent } from './maquina-sede-datos/maquina-sede-datos.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatRippleModule} from "@angular/material/core";
import {MdlMaquinasedeTecnologiaModule} from "../modals/mdl-maquinasede-tecnologia/mdl-maquinasede-tecnologia.module";
import {MdlMaquinaSedeAsignarPerfilesModule} from "../modals/mdl-maquina-sede-asignar-perfiles/mdl-maquina-sede-asignar-perfiles.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaquinaSedeRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatBottomSheetModule,
        MatRippleModule,
        MdlMaquinasedeTecnologiaModule,
        MdlMaquinaSedeAsignarPerfilesModule
    ],
    declarations: [
        MaquinaSedeListadoComponent,
        MaquinaSedeDatosComponent
    ]
})
export class MaquinaSedeModule { }
