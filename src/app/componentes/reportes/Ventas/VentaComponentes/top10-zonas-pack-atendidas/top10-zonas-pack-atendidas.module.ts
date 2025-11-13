import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartModule} from "angular2-chartjs";
import {MorrisJsModule} from "angular-morris-js";

import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {Top10ZonasPackAtendidasComponent} from "./top10-zonas-pack-atendidas.component";

@NgModule({
  declarations: [Top10ZonasPackAtendidasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    ChartModule,
    MorrisJsModule,
    MatProgressBarModule
  ],
  exports: [Top10ZonasPackAtendidasComponent],
  providers: [],
  bootstrap: [Top10ZonasPackAtendidasComponent]
})
export class Top10ZonasPackAtendidasModule { }
