import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {SharedModule} from "../../../theme/shared/shared.module";
import {AgendarCitaRoutingModule} from "./agendar-cita-routing.module";
import {AgendarCitaComponent} from "./agendar-cita.component";


@NgModule({
  declarations: [AgendarCitaComponent],
  imports: [
    CommonModule,
    AgendarCitaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule
  ],
  exports: [AgendarCitaComponent],
  providers: [],
  bootstrap: [AgendarCitaComponent]
})
export class AgendarCitaModule { }
