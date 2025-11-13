import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SalaComponent} from "./sala.component";
import {SalaRoutingModule} from "./sala-routing.module";
import {MdlSalaModule} from "../../componente/modal/mdl-sala/mdl-sala.module";


@NgModule({
  declarations: [SalaComponent],
  imports: [
    CommonModule,
    SalaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlSalaModule
  ],
  exports:[SalaComponent],
  providers: [],
  bootstrap: [SalaComponent]
})
export class SalaModule { }
