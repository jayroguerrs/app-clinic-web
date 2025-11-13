import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MdlFacturaTokenComponent} from "./mdl-factura-token.component";
import {MatRippleModule} from "@angular/material/core";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaTokenComponent
    ],
    exports: [MdlFacturaTokenComponent],
    providers: [],
    bootstrap: [MdlFacturaTokenComponent]
})
export class MdlFacturaTokenModule { }
