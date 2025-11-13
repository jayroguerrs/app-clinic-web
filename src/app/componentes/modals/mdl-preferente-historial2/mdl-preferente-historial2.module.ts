import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { FontawesomeSvgModule } from '../../fontawesome-svg/fontawesome-svg.module';
import {MdlPreferenteHistorial2Component} from "./mdl-preferente-historial2.component";
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
  declarations: [
      MdlPreferenteHistorial2Component,
  ],
  exports: [MdlPreferenteHistorial2Component],
  providers: [],
  bootstrap: [MdlPreferenteHistorial2Component]

})
export class MdlPreferenteHistorial2Module { }
