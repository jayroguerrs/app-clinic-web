import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlComprobanteUnidadMedidaComponent} from "./mdl-comprobante-unidad-medida.component";
import {LoaderCircleModule} from "../../../loading/loader/loader-circle/loader-circle.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule,
        LoaderCircleModule
    ],
    declarations: [
        MdlComprobanteUnidadMedidaComponent
    ],
    exports: [MdlComprobanteUnidadMedidaComponent],
    providers: [],
    bootstrap: [MdlComprobanteUnidadMedidaComponent]
})
export class MdlComprobanteUnidadMedidaModule { }
