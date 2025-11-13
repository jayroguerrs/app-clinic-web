import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {TblClienteCronogramasComponent} from "./tbl-cliente-cronogramas.component";
import {FontawesomeSvgModule} from "../../../../componentes/fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";


@NgModule({
  declarations: [TblClienteCronogramasComponent],
  imports: [
    CommonModule,
    MatRippleModule,
    FontawesomeSvgModule,
    DataTablesModule,
    MatProgressBarModule
  ],
  exports: [TblClienteCronogramasComponent],
  providers: [],
  bootstrap: [TblClienteCronogramasComponent]
})
export class TblClienteCronogramasModule { }
