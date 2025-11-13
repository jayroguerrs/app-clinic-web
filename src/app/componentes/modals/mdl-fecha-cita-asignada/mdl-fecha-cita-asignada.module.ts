import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MdlFechaCitaAsignadaComponent} from "./mdl-fecha-cita-asignada.component";
import {SharedModule} from "../../../theme/shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlFechaCitaAsignadaComponent
    ]
})
export class MdlFechaCitaAsignadaModule { }
