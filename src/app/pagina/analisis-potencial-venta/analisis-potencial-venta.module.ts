import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalisisPotencialVentaRoutingModule } from './analisis-potencial-venta-routing.module';
import { AnalisisPotencialVentaComponent } from './analisis-potencial-venta.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
  declarations: [AnalisisPotencialVentaComponent],
  imports: [
    CommonModule,
    AnalisisPotencialVentaRoutingModule,
    ReactiveFormsModule,
    MatRippleModule,
    FontawesomeSvgModule,
    FlatpickrModule
  ],
  exports: [AnalisisPotencialVentaComponent],
  providers: [],
  bootstrap: [AnalisisPotencialVentaComponent]
})
export class AnalisisPotencialVentaModule { }
