import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {StickyClassDirectiveModule} from "../../../../../shared/directive/sticky-class.directive";
import {PromocionAtendidosRangoComponent} from "./promocion-atendidos-rango.component";



@NgModule({
  declarations: [PromocionAtendidosRangoComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule,
    StickyClassDirectiveModule,
  ],
  exports: [PromocionAtendidosRangoComponent],
  providers: [DatePipe],
  bootstrap: [PromocionAtendidosRangoComponent]
})
export class PromocionAtendidosRangoModule { }
