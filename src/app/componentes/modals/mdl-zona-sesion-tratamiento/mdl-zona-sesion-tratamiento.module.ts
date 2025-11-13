import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MdlZonaSesionTratamientoComponent} from "./mdl-zona-sesion-tratamiento.component";
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    NgSelectModule,
    FormsModule,
  ],
    declarations: [
      MdlZonaSesionTratamientoComponent
    ],
    exports: [MdlZonaSesionTratamientoComponent],
    providers: [],
    bootstrap: [MdlZonaSesionTratamientoComponent]
})
export class MdlZonaSesionTratamientoModule { }
