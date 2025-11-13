import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {OperacionHistoriasMasivasComponent} from "./operacion-historias-masivas.component";
import {OperacionHistoriasMasivasRoutingModule} from "./operacion-historias-masivas-routing.module";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [OperacionHistoriasMasivasComponent],
  imports: [
    CommonModule,
    OperacionHistoriasMasivasRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    DataTablesModule
  ],
  exports: [OperacionHistoriasMasivasComponent],
  providers: [],
  bootstrap: [OperacionHistoriasMasivasComponent]
})
export class OperacionHistoriasMasivasModule { }
