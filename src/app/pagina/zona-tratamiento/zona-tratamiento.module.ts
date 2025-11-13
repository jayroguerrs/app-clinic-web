import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ZonaTratamientoComponent} from "./zona-tratamiento.component";
import {ZonaTratamientoRoutingModule} from "./zona-tratamiento-routing.module";
import {MdlZonaTratamientoModule} from "../../componentes/modals/mdl-zona-tratamiento/mdl-zona-tratamiento.module";


@NgModule({
  declarations: [ZonaTratamientoComponent],
  imports: [
    CommonModule,
    ZonaTratamientoRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,
    MdlZonaTratamientoModule
  ],
  exports: [ZonaTratamientoComponent],
  providers: [],
  bootstrap: [ZonaTratamientoComponent]
})
export class ZonaTratamientoModule { }
