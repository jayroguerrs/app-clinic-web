import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlCambiarClaveComponent} from "./mdl-cambiar-clave.component";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
    declarations: [
        MdlCambiarClaveComponent,
    ],
    exports: [MdlCambiarClaveComponent]
})
export class MdlCambiarClaveModule { }
