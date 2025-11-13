import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Top10ZonasAtendidasComponent} from "./top10-zonas-atendidas.component";
import {ChartModule} from "angular2-chartjs";
import {MorrisJsModule} from "angular-morris-js";

import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [Top10ZonasAtendidasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    ChartModule,
    MorrisJsModule,
    MatProgressBarModule
  ],
  exports: [Top10ZonasAtendidasComponent],
  providers: [],
  bootstrap: [Top10ZonasAtendidasComponent]
})
export class Top10ZonasAtendidasModule { }
