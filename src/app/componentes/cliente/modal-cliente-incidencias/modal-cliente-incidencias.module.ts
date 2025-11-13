import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalClienteIncidenciasComponent } from './modal-cliente-incidencias.component';
import {IonicModule} from "@ionic/angular";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";



@NgModule({
  declarations: [ModalClienteIncidenciasComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatProgressBarModule,
    DataTablesModule
  ],
  exports: [ModalClienteIncidenciasComponent],
  providers: [],
  bootstrap: [ModalClienteIncidenciasComponent]
})
export class ModalClienteIncidenciasModule { }
