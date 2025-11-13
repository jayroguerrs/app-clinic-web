import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {LoaderCircleModule} from "../../../loading/loader/loader-circle/loader-circle.module";
import {MdlComprobanteSerieComponent} from "./mdl-comprobante-serie.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule,
        LoaderCircleModule
    ],
    declarations: [
        MdlComprobanteSerieComponent
    ],
    exports: [MdlComprobanteSerieComponent],
    providers: [],
    bootstrap: [MdlComprobanteSerieComponent]
})
export class MdlComprobanteSerieModule { }
