import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../../theme/shared/shared.module";
import {TblComprobanteTipoNotaCreditoModule} from "../../../componentes/tables/facturacion/tbl-comprobante-tipo-nota-credito/tbl-comprobante-tipo-nota-credito.module";
import {MdlComprobanteTipoNotaCreditoModule} from "../../../componentes/modals/facturacion/mdl-comprobante-tipo-nota-credito/mdl-comprobante-tipo-nota-credito.module";
import {ComprobanteTipoNotaCreditoComponent} from "./comprobante-tipo-nota-credito.component";
import {ComprobanteTipoNotaCreditoRoutingModule} from "./comprobante-tipo-nota-credito-routing.module";


@NgModule({
  declarations: [ComprobanteTipoNotaCreditoComponent],
  imports: [
    CommonModule,
    ComprobanteTipoNotaCreditoRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblComprobanteTipoNotaCreditoModule,
    MdlComprobanteTipoNotaCreditoModule
  ],
  exports: [ComprobanteTipoNotaCreditoComponent],
  providers: [],
  bootstrap: [ComprobanteTipoNotaCreditoComponent]
})
export class ComprobanteTipoNotaCreditoModule { }
