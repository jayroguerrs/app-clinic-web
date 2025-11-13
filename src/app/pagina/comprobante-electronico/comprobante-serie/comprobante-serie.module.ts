import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ComprobanteSerieComponent} from "./comprobante-serie.component";
import {ComprobanteSerieRoutingModule} from "./comprobante-serie-routing.module";
import {SharedModule} from "../../../theme/shared/shared.module";
import {MdlComprobanteSerieModule} from "../../../componentes/modals/facturacion/mdl-comprobante-serie/mdl-comprobante-serie.module";
import {TblComprobanteSerieModule} from "../../../componentes/tables/facturacion/tbl-comprobante-serie/tbl-comprobante-serie.module";


@NgModule({
  declarations: [ComprobanteSerieComponent],
  imports: [
    CommonModule,
    ComprobanteSerieRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblComprobanteSerieModule,
    MdlComprobanteSerieModule
  ],
  exports: [ComprobanteSerieComponent],
  providers: [],
  bootstrap: [ComprobanteSerieComponent]
})
export class ComprobanteSerieModule { }
