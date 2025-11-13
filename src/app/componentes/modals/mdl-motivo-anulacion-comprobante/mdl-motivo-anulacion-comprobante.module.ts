import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlMotivoAnulacionComprobanteComponent} from "./mdl-motivo-anulacion-comprobante.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule,
        FontawesomeSvgModule,
    ],
    declarations: [
        MdlMotivoAnulacionComprobanteComponent
    ],
    exports: [MdlMotivoAnulacionComprobanteComponent],
    providers: [],
    bootstrap: [MdlMotivoAnulacionComprobanteComponent]
})
export class MdlMotivoAnulacionComprobanteModule { }
