import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {FacturaTipoIgvComponent} from "./factura-tipo-igv.component";
import {FacturaTipoIgvRoutingModule} from "./factura-tipo-igv-routing.module";
import {TblFacturaTipoIgvModule} from "../../componentes/tables/facturacion/tbl-factura-tipo-igv/tbl-factura-tipo-igv.module";
import {MdlFacturaTipoIgvModule} from "../../componentes/modals/facturacion/mdl-factura-tipo-igv/mdl-factura-tipo-igv.module";


@NgModule({
  declarations: [FacturaTipoIgvComponent],
  imports: [
    CommonModule,
    FacturaTipoIgvRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblFacturaTipoIgvModule,
    MdlFacturaTipoIgvModule
  ],
  exports: [FacturaTipoIgvComponent],
  providers: [],
  bootstrap: [FacturaTipoIgvComponent]
})
export class FacturaTipoIgvModule { }
