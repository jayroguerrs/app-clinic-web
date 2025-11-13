import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {MdlClienteAsignadoEstadosComponent} from "./mdl-cliente-asignado-estados.component";
import {MatRippleModule} from "@angular/material/core";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule,
    MatRippleModule
  ],
    declarations: [
        MdlClienteAsignadoEstadosComponent,
    ],
    exports: [MdlClienteAsignadoEstadosComponent]
})

export class MdlClienteAsignadoEstadosModule { }
