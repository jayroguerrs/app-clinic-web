import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../../theme/shared/shared.module";
import {TblComprobanteTipoNotaDebitoModule} from "../../../componentes/tables/facturacion/tbl-comprobante-tipo-nota-debito/tbl-comprobante-tipo-nota-debito.module";
import {MdlComprobanteTipoNotaDebitoModule} from "../../../componentes/modals/facturacion/mdl-comprobante-tipo-nota-debito/mdl-comprobante-tipo-nota-debito.module";
import {ComprobanteTipoNotaDebitoComponent} from "./comprobante-tipo-nota-debito.component";
import {ComprobanteTipoNotaDebitoRoutingModule} from "./comprobante-tipo-nota-debito-routing.module";


@NgModule({
  declarations: [ComprobanteTipoNotaDebitoComponent],
  imports: [
    CommonModule,
    ComprobanteTipoNotaDebitoRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblComprobanteTipoNotaDebitoModule,
    MdlComprobanteTipoNotaDebitoModule
  ],
  exports: [ComprobanteTipoNotaDebitoComponent],
  providers: [],
  bootstrap: [ComprobanteTipoNotaDebitoComponent]
})
export class ComprobanteTipoNotaDebitoModule { }
