import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlVerClaveComponent} from "./mdl-ver-clave.component";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
    declarations: [
        MdlVerClaveComponent,
    ],
    exports: [MdlVerClaveComponent]
})
export class MdlVerClaveModule { }
