import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { ServicioComponent } from './servicio.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MdlServicioModule} from "../../componente/modal/mdl-servicio/mdl-servicio.module";


@NgModule({
  declarations: [ServicioComponent],
  imports: [
    CommonModule,
    ServicioRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlServicioModule
  ],
  exports: [ServicioComponent],
  providers: [],
  bootstrap: [ServicioComponent]
})
export class ServicioModule { }
