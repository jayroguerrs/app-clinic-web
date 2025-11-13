import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {TipoCitaComponent} from "./tipo-cita.component";
import {TipoCitaRoutingModule} from "./tipo-cita-routing.module";
import {MdlTipoCitaModule} from "../../componente/modal/mdl-tipo-cita/mdl-tipo-cita.module";


@NgModule({
  declarations: [TipoCitaComponent],
  imports: [
    CommonModule,
    TipoCitaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlTipoCitaModule
  ],
  exports:[TipoCitaComponent],
  providers: [],
  bootstrap: [TipoCitaComponent]
})
export class TipoCitaModule { }
