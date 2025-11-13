import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { FontawesomeSvgModule } from '../../fontawesome-svg/fontawesome-svg.module';
import {MdlClienteAsignadoHistorialComponent} from "./mdl-cliente-asignado-historial.component";
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    FontawesomeSvgModule
  ],
  declarations: [
      MdlClienteAsignadoHistorialComponent,
  ],
  exports: [MdlClienteAsignadoHistorialComponent],
  providers: [],
  bootstrap: [MdlClienteAsignadoHistorialComponent]

})
export class MdlClienteAsignadoHistorialModule { }
