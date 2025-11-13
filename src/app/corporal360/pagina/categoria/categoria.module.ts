import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {CategoriaComponent} from "./categoria.component";
import {CategoriaRoutingModule} from "./categoria-routing.module";
import {MdlCategoriaModule} from "../../componente/modal/mdl-categoria/mdl-categoria.module";


@NgModule({
  declarations: [CategoriaComponent],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlCategoriaModule
  ],
  exports:[CategoriaComponent],
  providers: [],
  bootstrap: [CategoriaComponent]
})
export class CategoriaModule { }
