import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {FacturaPorcentajeIgvRoutingModule} from "./factura-porcentaje-igv-routing.module";
import {TblFacturaPorcentajeIgvModule} from "../../componentes/tables/facturacion/tbl-factura-porcentaje-igv/tbl-factura-porcentaje-igv.module";
import {MdlFacturaPorcentajeIgvModule} from "../../componentes/modals/facturacion/mdl-factura-porcentaje-igv/mdl-factura-porcentaje-igv.module";
import {FacturaPorcentajeIgvComponent} from "./factura-porcentaje-igv.component";


@NgModule({
  declarations: [FacturaPorcentajeIgvComponent],
  imports: [
    CommonModule,
    FacturaPorcentajeIgvRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,

    TblFacturaPorcentajeIgvModule,
    MdlFacturaPorcentajeIgvModule
  ],
  exports: [FacturaPorcentajeIgvComponent],
  providers: [],
  bootstrap: [FacturaPorcentajeIgvComponent]
})
export class FacturaPorcentajeIgvModule { }
