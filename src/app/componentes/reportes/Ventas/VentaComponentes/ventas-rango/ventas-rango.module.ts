import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {VentasRangoComponent} from "./ventas-rango.component";
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {StickyClassDirectiveModule} from "../../../../../shared/directive/sticky-class.directive";



@NgModule({
  declarations: [VentasRangoComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule,
    StickyClassDirectiveModule,
  ],
  exports: [VentasRangoComponent],
  providers: [DatePipe],
  bootstrap: [VentasRangoComponent]
})
export class VentasRangoModule { }
