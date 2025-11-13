import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import { MdlVerCitasClienteAsignadoComponent } from './mdl-ver-citas-cliente-asignado.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule
  ],
    declarations: [
        MdlVerCitasClienteAsignadoComponent,
    ],
    exports: [MdlVerCitasClienteAsignadoComponent]
})

export class MdlVerCitasClienteAsignadoModule { }
