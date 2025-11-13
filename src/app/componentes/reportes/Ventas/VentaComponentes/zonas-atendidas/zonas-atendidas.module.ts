import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartModule} from "angular2-chartjs";
import {MorrisJsModule} from "angular-morris-js";

import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ZonasAtendidasComponent} from "./zonas-atendidas.component";

@NgModule({
  declarations: [ZonasAtendidasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    ChartModule,
    MorrisJsModule,
    MatProgressBarModule
  ],
  exports: [ZonasAtendidasComponent],
  providers: [],
  bootstrap: [ZonasAtendidasComponent]
})
export class ZonasAtendidasModule { }
