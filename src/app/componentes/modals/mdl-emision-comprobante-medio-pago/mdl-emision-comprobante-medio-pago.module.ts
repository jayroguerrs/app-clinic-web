import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MdlEmisionComprobanteMedioPagoComponent} from "./mdl-emision-comprobante-medio-pago.component";
import {MatRippleModule} from "@angular/material/core";
import {NgxCurrencyModule} from "ngx-currency";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";


@NgModule({
    imports: [
      CommonModule,
      MatRippleModule,
      NgxCurrencyModule,
      NgbTooltipModule,
      FormsModule
    ],
    declarations: [
        MdlEmisionComprobanteMedioPagoComponent
    ],
    exports: [MdlEmisionComprobanteMedioPagoComponent],
    providers: [],
    bootstrap: [MdlEmisionComprobanteMedioPagoComponent]
})
export class MdlEmisionComprobanteMedioPagoModule { }
