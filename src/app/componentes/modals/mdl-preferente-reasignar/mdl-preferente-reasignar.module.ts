import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MatRippleModule} from "@angular/material/core";
import {LoaderCircleModule} from "../../loading/loader/loader-circle/loader-circle.module";
import {MdlPreferenteReasignarComponent} from "./mdl-preferente-reasignar.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {PreferenteObservacionModule} from "../../widgets/preferente-observacion/preferente-observacion.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ColorPickerModule,
        MatRippleModule,
        LoaderCircleModule,
        NgSelectModule,
        PreferenteObservacionModule
    ],
    declarations: [
        MdlPreferenteReasignarComponent
    ],
    exports: [MdlPreferenteReasignarComponent],
    providers: [],
    bootstrap: [MdlPreferenteReasignarComponent]
})
export class MdlPreferenteReasignarModule { }
