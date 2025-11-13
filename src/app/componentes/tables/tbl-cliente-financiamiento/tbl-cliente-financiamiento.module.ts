import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {TblClienteFinanciamientoComponent} from "./tbl-cliente-financiamiento.component";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [TblClienteFinanciamientoComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    DataTablesModule
  ],
  exports: [TblClienteFinanciamientoComponent],
  providers: [],
  bootstrap: [TblClienteFinanciamientoComponent]
})
export class TblClienteFinanciamientoModule { }
