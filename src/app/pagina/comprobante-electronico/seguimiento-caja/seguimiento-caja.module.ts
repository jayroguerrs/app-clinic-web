import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ReactiveFormsModule} from "@angular/forms";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {LoaderCircleModule} from "../../../componentes/loading/loader/loader-circle/loader-circle.module";
import {DisableControlModule} from "../../../shared/directive/disable-control/disable-control.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {SeguimientoCajaComponent} from "./seguimiento-caja.component";
import {SeguimientoCajaRoutingModule} from "./seguimiento-caja-routing.module";

@NgModule({
  declarations: [SeguimientoCajaComponent],
  imports: [
    CommonModule,
    SeguimientoCajaRoutingModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    LoaderCircleModule,
    DisableControlModule,
    MatProgressBarModule
  ],
  exports: [SeguimientoCajaComponent],
  providers: [],
  bootstrap: [SeguimientoCajaComponent]
})
export class SeguimientoCajaModule { }
