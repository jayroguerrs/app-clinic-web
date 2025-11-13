import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MdlPromocionCategoriaComponent} from "./mdl-promocion-categoria.component";
import {SharedModule} from "../../../theme/shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlPromocionCategoriaComponent
    ]
})
export class MdlPromocionCategoriaModule { }
