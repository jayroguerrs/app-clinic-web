import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskModule} from "ngx-mask";
import {LoaderCircleModule} from "../../../loading/loader/loader-circle/loader-circle.module";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {MdlListaDatosClienteComprobanteComponent} from "./mdl-lista-datos-cliente-comprobante.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule,
        LoaderCircleModule,
        FontawesomeSvgModule,
        NgbTooltipModule,
        NgxMaskModule
    ],
    declarations: [
        MdlListaDatosClienteComprobanteComponent
    ],
    exports: [MdlListaDatosClienteComprobanteComponent],
    providers: [],
    bootstrap: [MdlListaDatosClienteComprobanteComponent]
})
export class MdlListaDatosClienteComprobanteModule { }
