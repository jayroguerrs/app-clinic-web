import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartModule} from "angular2-chartjs";
import {MorrisJsModule} from "angular-morris-js";

import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PromocionZonasRankingComponent} from "./promocion-zonas-ranking.component";


@NgModule({
  declarations: [PromocionZonasRankingComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    ChartModule,
    MorrisJsModule,
    MatProgressBarModule
  ],
  exports: [PromocionZonasRankingComponent],
  providers: [],
  bootstrap: [PromocionZonasRankingComponent]
})
export class PromocionZonasRankingModule { }
