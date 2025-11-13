import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidenciaRoutingModule } from './incidencia-routing.module';
import {IncidenciaComponent} from "./incidencia.component";
import {SharedModule} from "../../theme/shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {CardModule} from "../../theme/shared/components";
import {IncidenciaTablaModule} from "./incidencia-tabla/incidencia-tabla.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import {IncidenciaModalModule} from "./incidencia-modal/incidencia-modal.module";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [IncidenciaComponent],
  imports: [
    CommonModule,
    IncidenciaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatRippleModule,
    CardModule,
    IncidenciaTablaModule,
    IncidenciaModalModule,
    NgbTooltipModule,
    NgxSpinnerModule,

    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
  ],
  exports: [IncidenciaComponent],
  providers: [],
  bootstrap: [IncidenciaComponent]
})
export class IncidenciaModule { }
