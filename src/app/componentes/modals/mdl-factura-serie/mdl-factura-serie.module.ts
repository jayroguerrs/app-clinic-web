import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MdlFacturaSerieComponent} from "./mdl-factura-serie.component";
import {MatRippleModule} from "@angular/material/core";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        ColorPickerModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaSerieComponent
    ],
    exports: [MdlFacturaSerieComponent],
    providers: [],
    bootstrap: [MdlFacturaSerieComponent]
})
export class MdlFacturaSerieModule { }
