import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaTablaComponent } from './incidencia-tabla.component';
import {IonicModule} from "@ionic/angular";
import {DataTablesModule} from "angular-datatables";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [IncidenciaTablaComponent],
  imports: [
    CommonModule,
    IonicModule,
    DataTablesModule,
    NgxSpinnerModule,
    MatProgressBarModule
  ],
  exports: [IncidenciaTablaComponent],
  providers: [],
  bootstrap: [IncidenciaTablaComponent]
})
export class IncidenciaTablaModule { }
