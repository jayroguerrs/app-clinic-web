import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MdlCitaHistorialComponent} from "./mdl-cita-historial.component";
import {FontawesomeSvgModule} from "../../../../componentes/fontawesome-svg/fontawesome-svg.module";
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
  declarations: [
      MdlCitaHistorialComponent,
  ],
  exports: [MdlCitaHistorialComponent],
  providers: [],
  bootstrap: [MdlCitaHistorialComponent]

})
export class MdlCitaHistorialModule { }
