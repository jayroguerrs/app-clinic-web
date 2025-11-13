import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { FontawesomeSvgModule } from '../../fontawesome-svg/fontawesome-svg.module';
import { MdlPreferenteHistorialComponent } from './mdl-preferente-historial.component';
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
  declarations: [
      MdlPreferenteHistorialComponent,
  ],
  exports: [MdlPreferenteHistorialComponent],
  providers: [],
  bootstrap: [MdlPreferenteHistorialComponent]

})
export class MdlPreferenteHistorialModule { }
