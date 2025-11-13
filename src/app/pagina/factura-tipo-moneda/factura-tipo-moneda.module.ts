import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {FacturaTipoMonedaRoutingModule} from "./factura-tipo-moneda-routing.module";
import {FacturaTipoMonedaComponent} from "./factura-tipo-moneda.component";
import {TblFacturaMonedaModule} from "../../componentes/tables/facturacion/tbl-factura-moneda/tbl-factura-moneda.module";
import {MdlFacturaMonedaModule} from "../../componentes/modals/facturacion/mdl-factura-moneda/mdl-factura-moneda.module";


@NgModule({
  declarations: [FacturaTipoMonedaComponent],
  imports: [
    CommonModule,
    FacturaTipoMonedaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblFacturaMonedaModule,
    MdlFacturaMonedaModule
  ],
  exports: [FacturaTipoMonedaComponent],
  providers: [],
  bootstrap: [FacturaTipoMonedaComponent]
})
export class FacturaTipoMonedaModule { }
