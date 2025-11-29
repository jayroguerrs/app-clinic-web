import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioDatosComponent } from './usuario-datos/usuario-datos.component';
import { UsuarioListadoComponent } from './usuario-listado/usuario-listado.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {SelectOptionService} from '../../theme/shared/components/select/select-option.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FloatButtonModule} from "../../theme/shared/float/float.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MdlVerClaveModule} from "../modals/mdl-ver-clave/mdl-ver-clave.module";
import { UsuarioSupervisadosComponent } from './usuario-supervisados/usuario-supervisados.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsuarioRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        FormsModule,
        NgxSpinnerModule,
        MatIconModule,

        MatListModule,
        MatBottomSheetModule,
        MdlVerClaveModule
    ],
    declarations: [
        UsuarioListadoComponent,
        UsuarioDatosComponent,
        UsuarioSupervisadosComponent,
    ],
    providers: [SelectOptionService]
})
export class UsuarioModule { }
