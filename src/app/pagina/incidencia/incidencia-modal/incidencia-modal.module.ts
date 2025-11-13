import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaModalComponent } from './incidencia-modal.component';
import {IonicModule} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {ClienteSeleccionModule} from "../../../componentes/cliente/cliente-seleccion/cliente-seleccion.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [IncidenciaModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatRippleModule,
    ClienteSeleccionModule,
    MatProgressBarModule
  ],
  exports: [IncidenciaModalComponent],
  providers: [],
  bootstrap: [IncidenciaModalComponent]
})
export class IncidenciaModalModule {}
