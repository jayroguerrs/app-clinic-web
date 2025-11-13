import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MdlCitaEstadoComponent} from "./mdl-cita-estado.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FontawesomeSvgModule} from "../../../../componentes/fontawesome-svg/fontawesome-svg.module";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
    declarations: [
        MdlCitaEstadoComponent,
    ],
    exports: [MdlCitaEstadoComponent]
})
export class MdlCitaEstadoModule { }
