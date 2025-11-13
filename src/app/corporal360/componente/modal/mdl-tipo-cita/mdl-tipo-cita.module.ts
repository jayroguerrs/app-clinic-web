import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlTipoCitaComponent} from "./mdl-tipo-cita.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlTipoCitaComponent
    ],
    exports: [MdlTipoCitaComponent],
    providers: [],
    bootstrap: [MdlTipoCitaComponent]
})
export class MdlTipoCitaModule { }
