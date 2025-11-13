import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {MdlFacturaMonedaComponent} from "./mdl-factura-moneda.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlFacturaMonedaComponent
    ],
    exports: [MdlFacturaMonedaComponent],
    providers: [],
    bootstrap: [MdlFacturaMonedaComponent]
})
export class MdlFacturaMonedaModule { }
