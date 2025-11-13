import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlFacturaPorcentajeIgvComponent} from "./mdl-factura-porcentaje-igv.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaPorcentajeIgvComponent
    ],
    exports: [MdlFacturaPorcentajeIgvComponent],
    providers: [],
    bootstrap: [MdlFacturaPorcentajeIgvComponent]
})
export class MdlFacturaPorcentajeIgvModule { }
