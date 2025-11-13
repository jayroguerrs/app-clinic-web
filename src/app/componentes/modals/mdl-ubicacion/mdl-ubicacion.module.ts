import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MdlUbicacionComponent} from "./mdl-ubicacion.component";
import {MatRippleModule} from "@angular/material/core";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule
    ],
    declarations: [
        MdlUbicacionComponent
    ],
    exports: [MdlUbicacionComponent],
    providers: [],
    bootstrap: [MdlUbicacionComponent]
})
export class MdlUbicacionModule { }
