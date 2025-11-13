import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendarCitaCorporal360RoutingModule } from './agendar-cita-corporal360-routing.module';
import { AgendarCitaCorporal360Component } from './agendar-cita-corporal360.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [AgendarCitaCorporal360Component],
  imports: [
    CommonModule,
    AgendarCitaCorporal360RoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    ReactiveFormsModule
  ],
  exports: [AgendarCitaCorporal360Component],
  providers: [],
  bootstrap: [AgendarCitaCorporal360Component]
})
export class AgendarCitaCorporal360Module { }
