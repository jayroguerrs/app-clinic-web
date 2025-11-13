import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasoRoutingModule } from './caso-routing.module';
import { CasoComponent } from './caso.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MdlCasoModule} from "../../componente/modal/mdl-caso/mdl-caso.module";


@NgModule({
  declarations: [CasoComponent],
  imports: [
    CommonModule,
    CasoRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlCasoModule
  ],
  exports:[CasoComponent],
  providers: [],
  bootstrap: [CasoComponent]
})
export class CasoModule { }
