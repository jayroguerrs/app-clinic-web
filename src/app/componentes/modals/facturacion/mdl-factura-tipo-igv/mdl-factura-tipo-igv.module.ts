import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlFacturaTipoIgvComponent} from "./mdl-factura-tipo-igv.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaTipoIgvComponent
    ],
    exports: [MdlFacturaTipoIgvComponent],
    providers: [],
    bootstrap: [MdlFacturaTipoIgvComponent]
})
export class MdlFacturaTipoIgvModule { }
