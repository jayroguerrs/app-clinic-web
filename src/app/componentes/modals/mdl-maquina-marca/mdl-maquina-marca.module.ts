import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MdlMaquinaMarcaComponent} from "./mdl-maquina-marca.component";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        ColorPickerModule,
        NgSelectModule
    ],
    declarations: [
        MdlMaquinaMarcaComponent
    ],
    exports: [MdlMaquinaMarcaComponent],
    providers: [],
    bootstrap: [MdlMaquinaMarcaComponent]
})
export class MdlMaquinaMarcaModule { }
