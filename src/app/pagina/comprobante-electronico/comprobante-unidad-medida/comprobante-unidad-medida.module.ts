import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ComprobanteUnidadMedidaComponent} from "./comprobante-unidad-medida.component";
import {ComprobanteUnidadMedidaRoutingModule} from "./comprobante-unidad-medida-routing.module";
import {SharedModule} from "../../../theme/shared/shared.module";
import {TblComprobanteUnidadMedidaModule} from "../../../componentes/tables/facturacion/tbl-comprobante-unidad-medida/tbl-comprobante-unidad-medida.module";
import {MdlComprobanteUnidadMedidaModule} from "../../../componentes/modals/facturacion/mdl-comprobante-unidad-medida/mdl-comprobante-unidad-medida.module";


@NgModule({
  declarations: [ComprobanteUnidadMedidaComponent],
  imports: [
    CommonModule,
    ComprobanteUnidadMedidaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblComprobanteUnidadMedidaModule,
    MdlComprobanteUnidadMedidaModule
  ],
  exports: [ComprobanteUnidadMedidaComponent],
  providers: [],
  bootstrap: [ComprobanteUnidadMedidaComponent]
})
export class ComprobanteUnidadMedidaModule { }
