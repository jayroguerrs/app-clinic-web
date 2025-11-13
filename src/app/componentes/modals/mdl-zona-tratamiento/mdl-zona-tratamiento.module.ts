import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MdlZonaTratamientoComponent} from "./mdl-zona-tratamiento.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        ColorPickerModule
    ],
    declarations: [
        MdlZonaTratamientoComponent
    ],
    exports: [MdlZonaTratamientoComponent],
    providers: [],
    bootstrap: [MdlZonaTratamientoComponent]
})
export class MdlZonaTratamientoModule { }
