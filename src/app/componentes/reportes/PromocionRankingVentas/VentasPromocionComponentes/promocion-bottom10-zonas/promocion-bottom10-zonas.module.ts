import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartModule} from "angular2-chartjs";
import {MorrisJsModule} from "angular-morris-js";

import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PromocionBottom10ZonasComponent} from "./promocion-bottom10-zonas.component";

@NgModule({
  declarations: [PromocionBottom10ZonasComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    ChartModule,
    MorrisJsModule,
    MatProgressBarModule
  ],
  exports: [PromocionBottom10ZonasComponent],
  providers: [],
  bootstrap: [PromocionBottom10ZonasComponent]
})
export class PromocionBottom10ZonasModule { }
