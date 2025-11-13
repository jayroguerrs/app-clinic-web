import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";
import {OperacionGenerarSiguientesCitasComponent} from "./operacion-generar-siguientes-citas.component";
import {OperacionGenerarSiguientesCitasRoutingModule} from "./operacion-generar-siguientes-citas-routing.module";
import {LoaderCircleModule} from "../../componentes/loading/loader/loader-circle/loader-circle.module";
import {DisableControlModule} from "../../shared/directive/disable-control/disable-control.module";
import {FlatpickrModule} from "angularx-flatpickr";

@NgModule({
  declarations: [OperacionGenerarSiguientesCitasComponent],
  imports: [
    CommonModule,
    OperacionGenerarSiguientesCitasRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    DataTablesModule,
    LoaderCircleModule,
    DisableControlModule,
    FlatpickrModule
  ],
  exports: [OperacionGenerarSiguientesCitasComponent],
  providers: [],
  bootstrap: [OperacionGenerarSiguientesCitasComponent]
})
export class OperacionGenerarSiguientesCitasModule { }
