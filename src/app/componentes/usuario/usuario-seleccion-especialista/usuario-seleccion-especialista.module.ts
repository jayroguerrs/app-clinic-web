import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import {UsuarioSeleccionEspecialistaComponent} from "./usuario-seleccion-especialista.component";
import {SharedModule} from "../../../theme/shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DataTablesModule,
        FormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        UsuarioSeleccionEspecialistaComponent
    ],
    exports: [
        UsuarioSeleccionEspecialistaComponent
    ]
})
export class UsuarioSeleccionEspecialistaModule { }
