import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {StickyClassDirectiveModule} from "../../../../../shared/directive/sticky-class.directive";
import {PromocionVentasRangoComponent} from "./promocion-ventas-rango.component";



@NgModule({
  declarations: [PromocionVentasRangoComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule,
    StickyClassDirectiveModule,
  ],
  exports: [PromocionVentasRangoComponent],
  providers: [DatePipe],
  bootstrap: [PromocionVentasRangoComponent]
})
export class PromocionVentasRangoModule { }
