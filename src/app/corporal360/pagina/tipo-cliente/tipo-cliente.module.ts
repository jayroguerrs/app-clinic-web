import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {TipoClienteComponent} from "./tipo-cliente.component";
import {TipoClienteRoutingModule} from "./tipo-cliente-routing.module";
import {MdlTipoClienteModule} from "../../componente/modal/mdl-tipo-cliente/mdl-tipo-cliente.module";


@NgModule({
  declarations: [TipoClienteComponent],
  imports: [
    CommonModule,
    TipoClienteRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlTipoClienteModule
  ],
  exports:[TipoClienteComponent],
  providers: [],
  bootstrap: [TipoClienteComponent]
})
export class TipoClienteModule { }
