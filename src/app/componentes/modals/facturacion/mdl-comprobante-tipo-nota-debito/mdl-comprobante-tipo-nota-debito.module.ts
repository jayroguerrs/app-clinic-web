import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlComprobanteTipoNotaDebitoComponent} from "./mdl-comprobante-tipo-nota-debito.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlComprobanteTipoNotaDebitoComponent
    ],
    exports: [MdlComprobanteTipoNotaDebitoComponent],
    providers: [],
    bootstrap: [MdlComprobanteTipoNotaDebitoComponent]
})
export class MdlComprobanteTipoNotaDebitoModule { }
