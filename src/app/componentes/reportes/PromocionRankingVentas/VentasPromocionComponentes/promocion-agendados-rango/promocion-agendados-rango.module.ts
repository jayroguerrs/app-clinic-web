import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {StickyClassDirectiveModule} from "../../../../../shared/directive/sticky-class.directive";
import {PromocionAgendadosRangoComponent} from "./promocion-agendados-rango.component";



@NgModule({
  declarations: [PromocionAgendadosRangoComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule,
    StickyClassDirectiveModule,
  ],
  exports: [PromocionAgendadosRangoComponent],
  providers: [DatePipe],
  bootstrap: [PromocionAgendadosRangoComponent]
})
export class PromocionAgendadosRangoModule { }
