import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {CitaDetalleComponent} from "./cita-detalle.component";



@NgModule({
  declarations: [CitaDetalleComponent],
  imports: [
    CommonModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    MatRippleModule
  ],
  exports: [CitaDetalleComponent],
  providers: [],
  bootstrap: [CitaDetalleComponent]
})
export class CitaDetalleModule { }
