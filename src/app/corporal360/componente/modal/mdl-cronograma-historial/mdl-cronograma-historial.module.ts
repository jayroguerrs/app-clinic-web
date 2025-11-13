import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FontawesomeSvgModule} from "../../../../componentes/fontawesome-svg/fontawesome-svg.module";
import {MdlCronogramaHistorialComponent} from "./mdl-cronograma-historial.component";
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
  declarations: [
      MdlCronogramaHistorialComponent,
  ],
  exports: [MdlCronogramaHistorialComponent],
  providers: [],
  bootstrap: [MdlCronogramaHistorialComponent]

})
export class MdlCronogramaHistorialModule { }
