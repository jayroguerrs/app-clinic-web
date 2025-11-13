import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {CitasAgendadasCortesiaComponent} from "./citas-agendadas-cortesia.component";



@NgModule({
  declarations: [CitasAgendadasCortesiaComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule
  ],
  exports: [CitasAgendadasCortesiaComponent],
  providers: [DatePipe],
  bootstrap: [CitasAgendadasCortesiaComponent]
})
export class CitasAgendadasCortesiaModule { }
