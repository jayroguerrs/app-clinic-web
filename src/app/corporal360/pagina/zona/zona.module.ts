import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ZonaComponent} from "./zona.component";
import {ZonaRoutingModule} from "./zona-routing.module";
import {MdlZonaModule} from "../../componente/modal/mdl-zona/mdl-zona.module";


@NgModule({
  declarations: [ZonaComponent],
  imports: [
    CommonModule,
    ZonaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlZonaModule
  ],
  exports:[ZonaComponent],
  providers: [],
  bootstrap: [ZonaComponent]
})
export class ZonaModule { }
