import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {MdlVerCitasClienteAsignadoTrabajarComponent} from "./mdl-ver-citas-cliente-asignado-trabajar.component";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MdlClienteAsignadoEstadosModule} from "../mdl-cliente-asignado-estados/mdl-cliente-asignado-estados.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule,
    NgbTooltipModule,
    MatRippleModule,
    MdlClienteAsignadoEstadosModule
  ],
    declarations: [
        MdlVerCitasClienteAsignadoTrabajarComponent,
    ],
    exports: [MdlVerCitasClienteAsignadoTrabajarComponent]
})

export class MdlVerCitasClienteAsignadoTrabajarModule { }
