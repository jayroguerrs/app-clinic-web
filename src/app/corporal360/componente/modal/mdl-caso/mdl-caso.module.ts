import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlCasoComponent} from "./mdl-caso.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlCasoComponent
    ],
    exports: [MdlCasoComponent],
    providers: [],
    bootstrap: [MdlCasoComponent]
})
export class MdlCasoModule { }
