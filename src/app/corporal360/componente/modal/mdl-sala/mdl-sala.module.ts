import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlSalaComponent} from "./mdl-sala.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
    ],
    declarations: [
        MdlSalaComponent
    ],
    exports: [MdlSalaComponent],
    providers: [],
    bootstrap: [MdlSalaComponent]
})
export class MdlSalaModule { }
