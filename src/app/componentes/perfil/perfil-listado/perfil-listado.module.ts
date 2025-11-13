import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { PerfilListadoRoutingModule } from './perfil-listado-routing.module';
import { SharedModule } from '../../../theme/shared/shared.module';
import { PerfilListadoComponent } from './perfil-listado.component';
import { PerfilConfiguracionComponent } from '../perfil-configuracion/perfil-configuracion.component';
import { PerfilConfiguracionMenuComponent } from '../perfil-configuracion-menu/perfil-configuracion-menu.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FloatButtonModule} from "../../../theme/shared/float/float.module";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PerfilListadoRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule,
        NgbNavModule,

        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatBottomSheetModule
    ],
    declarations: [
        PerfilListadoComponent,
        PerfilConfiguracionComponent,
        PerfilConfiguracionMenuComponent
    ]
})
export class PerfilListadoModule { }
