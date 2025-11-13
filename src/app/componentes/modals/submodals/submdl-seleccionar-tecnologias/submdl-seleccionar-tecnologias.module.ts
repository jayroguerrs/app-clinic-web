import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {GroupButtonModule} from "../../../group-button/group-button.module";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {SubmdlSeleccionarTecnologiasComponent} from "./submdl-seleccionar-tecnologias.component";
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    SubmdlSeleccionarTecnologiasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    GroupButtonModule,
    FontawesomeSvgModule,
    DragDropModule
  ],
  exports: [SubmdlSeleccionarTecnologiasComponent],
  providers: [],
  bootstrap: [SubmdlSeleccionarTecnologiasComponent]
})
export class SubmdlSeleccionarTecnologiasModule { }
