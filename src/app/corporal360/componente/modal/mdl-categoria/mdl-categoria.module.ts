import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlCategoriaComponent} from "./mdl-categoria.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlCategoriaComponent
    ],
    exports: [MdlCategoriaComponent],
    providers: [],
    bootstrap: [MdlCategoriaComponent]
})
export class MdlCategoriaModule { }
