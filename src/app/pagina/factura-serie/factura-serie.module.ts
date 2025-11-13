import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {MdlFacturaSerieModule} from "../../componentes/modals/mdl-factura-serie/mdl-factura-serie.module";
import {TblFacturaSerieModule} from "../../componentes/tables/tbl-factura-serie/tbl-factura-serie.module";
import {FacturaSerieComponent} from "./factura-serie.component";
import {FacturaSerieRoutingModule} from "./factura-serie-routing.module";


@NgModule({
  declarations: [FacturaSerieComponent],
  imports: [
    CommonModule,
    FacturaSerieRoutingModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlFacturaSerieModule,
    TblFacturaSerieModule
  ],
  exports: [FacturaSerieComponent],
  providers: [],
  bootstrap: [FacturaSerieComponent]
})
export class FacturaSerieModule { }
