import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TecnologiaRoutingModule } from './tecnologia-routing.module';
import { TecnologiaComponent } from './tecnologia.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MdlTecnologiaModule} from "../../componentes/modals/mdl-tecnologia/mdl-tecnologia.module";


@NgModule({
  declarations: [TecnologiaComponent],
  imports: [
    CommonModule,
    TecnologiaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,
    MdlTecnologiaModule
  ],
  exports: [TecnologiaComponent],
  providers: [],
  bootstrap: [TecnologiaComponent]
})
export class TecnologiaModule { }
