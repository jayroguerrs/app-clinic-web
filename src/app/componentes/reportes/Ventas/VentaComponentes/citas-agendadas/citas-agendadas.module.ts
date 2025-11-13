import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {CitasAgendadasComponent} from "./citas-agendadas.component";



@NgModule({
  declarations: [CitasAgendadasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule
  ],
  exports: [CitasAgendadasComponent],
  providers: [DatePipe],
  bootstrap: [CitasAgendadasComponent]
})
export class CitasAgendadasModule { }
