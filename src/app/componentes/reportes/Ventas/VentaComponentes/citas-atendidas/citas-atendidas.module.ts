import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {CitasAtendidasComponent} from "./citas-atendidas.component";


@NgModule({
  declarations: [CitasAtendidasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule
  ],
  exports: [CitasAtendidasComponent],
  providers: [DatePipe],
  bootstrap: [CitasAtendidasComponent]
})
export class CitasAtendidasModule { }
