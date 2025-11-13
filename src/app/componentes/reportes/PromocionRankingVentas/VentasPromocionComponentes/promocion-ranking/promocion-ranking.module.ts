import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { PromocionRankingComponent } from './promocion-ranking.component';
import {SharedModule} from "../../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";



@NgModule({
  declarations: [PromocionRankingComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatProgressBarModule
  ],
  exports: [PromocionRankingComponent],
  providers: [DatePipe],
  bootstrap: [PromocionRankingComponent]
})
export class PromocionRankingModule { }
