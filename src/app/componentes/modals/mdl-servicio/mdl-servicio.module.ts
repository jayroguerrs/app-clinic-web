import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MdlServicioComponent} from "./mdl-servicio.component";
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        ColorPickerModule
    ],
    declarations: [
        MdlServicioComponent
    ],
    exports: [MdlServicioComponent],
    providers: [],
    bootstrap: [MdlServicioComponent]
})
export class MdlServicioModule { }
