import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {MdlMaquinaMarcaModule} from "../../componentes/modals/mdl-maquina-marca/mdl-maquina-marca.module";
import {MaquinaMarcaComponent} from "./maquina-marca.component";
import {MaquinaMarcaRoutingModule} from "./maquina-marca-routing.module";


@NgModule({
  declarations: [MaquinaMarcaComponent],
  imports: [
    CommonModule,
    MaquinaMarcaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlMaquinaMarcaModule
  ],
  exports: [MaquinaMarcaComponent],
  providers: [],
  bootstrap: [MaquinaMarcaComponent]
})
export class MaquinaMarcaModule { }
