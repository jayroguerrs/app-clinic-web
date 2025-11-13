import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlTipoClienteComponent} from "./mdl-tipo-cliente.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlTipoClienteComponent
    ],
    exports: [MdlTipoClienteComponent],
    providers: [],
    bootstrap: [MdlTipoClienteComponent]
})
export class MdlTipoClienteModule { }
