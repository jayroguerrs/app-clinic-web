import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MdlTratamientoComponent} from "./mdl-tratamiento.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        ColorPickerModule
    ],
    declarations: [
        MdlTratamientoComponent
    ],
    exports: [MdlTratamientoComponent],
    providers: [],
    bootstrap: [MdlTratamientoComponent]
})
export class MdlTratamientoModule { }
