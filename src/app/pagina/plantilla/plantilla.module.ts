import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {MdlPlantillaModule} from "../../componentes/modals/mdl-plantilla/mdl-plantilla.module";
import {PlantillaRoutingModule} from "./plantilla-routing.module";
import {PlantillaComponent} from "./plantilla.component";


@NgModule({
  declarations: [PlantillaComponent],
  imports: [
    CommonModule,
    PlantillaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,

    MdlPlantillaModule
  ],
  exports: [PlantillaComponent],
  providers: [],
  bootstrap: [PlantillaComponent]
})
export class PlantillaModule { }
