import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartModule} from "angular2-chartjs";
import {MorrisJsModule} from "angular-morris-js";

import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PromocionTop10ZonasComponent} from "./promocion-top10-zonas.component";

@NgModule({
  declarations: [PromocionTop10ZonasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    ChartModule,
    MorrisJsModule,
    MatProgressBarModule
  ],
  exports: [PromocionTop10ZonasComponent],
  providers: [],
  bootstrap: [PromocionTop10ZonasComponent]
})
export class PromocionTop10ZonasModule { }
