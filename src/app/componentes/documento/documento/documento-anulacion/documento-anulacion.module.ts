import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../../../theme/shared/shared.module';
import {DocumentoAnulacionComponent} from "./documento-anulacion.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        NgxSpinnerModule
    ],
    declarations: [
        DocumentoAnulacionComponent
    ],
    exports: [
      DocumentoAnulacionComponent
    ],
    providers: [],
    bootstrap: []
})
export class DocumentoAnulacionModule { }
