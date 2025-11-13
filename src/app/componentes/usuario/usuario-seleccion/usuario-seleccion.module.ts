import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UsuarioSeleccionComponent } from './usuario-seleccion.component'
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

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
        UsuarioSeleccionComponent
    ],
    exports: [
        UsuarioSeleccionComponent
    ]
})
export class UsuarioSeleccionModule { }