import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlServicioComponent} from "./mdl-servicio.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlServicioComponent
    ],
    exports: [MdlServicioComponent],
    providers: [],
    bootstrap: [MdlServicioComponent]
})
export class MdlServicioModule { }
