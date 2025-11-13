import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlSiguienteCitaComponent} from "./mdl-siguiente-cita.component";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
    declarations: [
        MdlSiguienteCitaComponent,
    ],
    exports: [MdlSiguienteCitaComponent]
})
export class MdlSiguienteCitaModule { }
