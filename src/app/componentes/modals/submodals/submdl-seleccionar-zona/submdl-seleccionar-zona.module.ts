import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {GroupButtonModule} from "../../../group-button/group-button.module";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { SubmdlSeleccionarZonaComponent } from './submdl-seleccionar-zona.component';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  declarations: [
    SubmdlSeleccionarZonaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgbTooltipModule,
    GroupButtonModule,
    FontawesomeSvgModule,
    DragDropModule,
    FlatpickrModule,
    FormsModule
  ],
  exports: [SubmdlSeleccionarZonaComponent],
  providers: [],
  bootstrap: [SubmdlSeleccionarZonaComponent]
})
export class SubmdlSeleccionarZonaModule { }
