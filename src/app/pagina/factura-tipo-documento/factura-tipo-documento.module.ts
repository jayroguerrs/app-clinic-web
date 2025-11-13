import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {FacturaTipoDocumentoRoutingModule} from "./factura-tipo-documento-routing.module";
import {FacturaTipoDocumentoComponent} from "./factura-tipo-documento.component";
import {TblFacturaTipoDocumentoModule} from "../../componentes/tables/facturacion/tbl-factura-tipo-documento/tbl-factura-tipo-documento.module";
import {MdlFacturaTipoDocumentoModule} from "../../componentes/modals/facturacion/mdl-factura-tipo-documento/mdl-factura-tipo-documento.module";


@NgModule({
  declarations: [FacturaTipoDocumentoComponent],
  imports: [
    CommonModule,
    FacturaTipoDocumentoRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblFacturaTipoDocumentoModule,
    MdlFacturaTipoDocumentoModule
  ],
  exports: [FacturaTipoDocumentoComponent],
  providers: [],
  bootstrap: [FacturaTipoDocumentoComponent]
})
export class FacturaTipoDocumentoModule { }
