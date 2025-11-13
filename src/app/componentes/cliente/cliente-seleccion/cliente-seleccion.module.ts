import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ClienteSeleccionComponent} from "./cliente-seleccion.component";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PerfectScrollbarModule
    ],
    declarations: [
        ClienteSeleccionComponent
    ],
    exports: [
        ClienteSeleccionComponent
    ]
})
export class ClienteSeleccionModule { }
