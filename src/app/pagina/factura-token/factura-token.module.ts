import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {FacturaTokenComponent} from "./factura-token.component";
import {FacturaTokenRoutingModule} from "./factura-token-routing.module";
import {TblFacturaTokenModule} from "../../componentes/tables/facturacion/tbl-factura-token/tbl-factura-token.module";
import {MdlFacturaTokenModule} from "../../componentes/modals/facturacion/mdl-factura-token/mdl-factura-token.module";


@NgModule({
  declarations: [FacturaTokenComponent],
  imports: [
    CommonModule,
    FacturaTokenRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblFacturaTokenModule,
    MdlFacturaTokenModule
  ],
  exports: [FacturaTokenComponent],
  providers: [],
  bootstrap: [FacturaTokenComponent]
})
export class FacturaTokenModule { }
