import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlFacturaTipoDocumentoComponent} from "./mdl-factura-tipo-documento.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaTipoDocumentoComponent
    ],
    exports: [MdlFacturaTipoDocumentoComponent],
    providers: [],
    bootstrap: [MdlFacturaTipoDocumentoComponent]
})
export class MdlFacturaTipoDocumentoModule { }
