import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {FacturaTransaccionSunatRoutingModule} from "./factura-transaccion-sunat-routing.module";
import {FacturaTransaccionSunatComponent} from "./factura-transaccion-sunat.component";
import {MdlFacturaTransaccionSunatModule} from "../../componentes/modals/facturacion/mdl-factura-transaccion-sunat/mdl-factura-transaccion-sunat.module";
import {TblFacturaTransaccionSunatModule} from "../../componentes/tables/facturacion/tbl-factura-transaccion-sunat/tbl-factura-transaccion-sunat.module";


@NgModule({
  declarations: [FacturaTransaccionSunatComponent],
  imports: [
    CommonModule,
    FacturaTransaccionSunatRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblFacturaTransaccionSunatModule,
    MdlFacturaTransaccionSunatModule
  ],
  exports: [FacturaTransaccionSunatComponent],
  providers: [],
  bootstrap: [FacturaTransaccionSunatComponent]
})
export class FacturaTransaccionSunatModule { }
