import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {SubmdlSeleccionarZonasComponent} from "./submdl-seleccionar-zonas.component";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {GroupButtonModule} from "../../../group-button/group-button.module";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";

@NgModule({
  declarations: [
    SubmdlSeleccionarZonasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    GroupButtonModule,
    FontawesomeSvgModule
  ],
  exports: [SubmdlSeleccionarZonasComponent],
  providers: [],
  bootstrap: [SubmdlSeleccionarZonasComponent]
})
export class SubmdlSeleccionarZonasModule { }
