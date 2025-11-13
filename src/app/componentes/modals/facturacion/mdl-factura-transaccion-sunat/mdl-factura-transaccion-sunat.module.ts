import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlFacturaTransaccionSunatComponent} from "./mdl-factura-transaccion-sunat.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaTransaccionSunatComponent
    ],
    exports: [MdlFacturaTransaccionSunatComponent],
    providers: [],
    bootstrap: [MdlFacturaTransaccionSunatComponent]
})
export class MdlFacturaTransaccionSunatModule { }
