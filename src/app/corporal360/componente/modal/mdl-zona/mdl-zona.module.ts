import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {MdlZonaComponent} from "./mdl-zona.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        MdlZonaComponent
    ],
    exports: [MdlZonaComponent],
    providers: [],
    bootstrap: [MdlZonaComponent]
})
export class MdlZonaModule { }
