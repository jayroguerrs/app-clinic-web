import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlComprobanteTipoNotaCreditoComponent} from "./mdl-comprobante-tipo-nota-credito.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlComprobanteTipoNotaCreditoComponent
    ],
    exports: [MdlComprobanteTipoNotaCreditoComponent],
    providers: [],
    bootstrap: [MdlComprobanteTipoNotaCreditoComponent]
})
export class MdlComprobanteTipoNotaCreditoModule { }
