import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {SharedModule} from "../../theme/shared/shared.module";
import {MdlPlantillaModule} from "../../componentes/modals/mdl-plantilla/mdl-plantilla.module";
import {ModuloPlantillaComponent} from "./modulo-plantilla.component";
import {ModuloPlantillaRoutingModule} from "./modulo-plantilla-routing.module";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";


@NgModule({
  declarations: [ModuloPlantillaComponent],
  imports: [
    CommonModule,
    ModuloPlantillaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,
    FontawesomeSvgModule
  ],
  exports: [ModuloPlantillaComponent],
  providers: [],
  bootstrap: [ModuloPlantillaComponent]
})
export class ModuloPlantillaModule { }
