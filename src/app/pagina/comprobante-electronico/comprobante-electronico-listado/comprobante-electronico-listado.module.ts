import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ComprobanteElectronicoListadoComponent} from "./comprobante-electronico-listado.component";
import {ComprobanteElectronicoListadoRoutingModule} from "./comprobante-electronico-listado-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {LoaderCircleModule} from "../../../componentes/loading/loader/loader-circle/loader-circle.module";
import {DisableControlModule} from "../../../shared/directive/disable-control/disable-control.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MdlPdfGoogleViewModule} from "../../../componentes/modals/mdl-pdf-google-view/mdl-pdf-google-view.module";
import {MdlAnularComprobanteModule} from "../../../componentes/modals/mdl-anular-comprobante/mdl-anular-comprobante.module";
import {MdlMotivoAnulacionComprobanteModule} from "../../../componentes/modals/mdl-motivo-anulacion-comprobante/mdl-motivo-anulacion-comprobante.module";

@NgModule({
  declarations: [ComprobanteElectronicoListadoComponent],
  imports: [
    CommonModule,
    ComprobanteElectronicoListadoRoutingModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    LoaderCircleModule,
    DisableControlModule,
    MatProgressBarModule,
    MdlPdfGoogleViewModule,
    MdlAnularComprobanteModule,
    MdlMotivoAnulacionComprobanteModule
  ],
  exports: [ComprobanteElectronicoListadoComponent],
  providers: [],
  bootstrap: [ComprobanteElectronicoListadoComponent]
})
export class ComprobanteElectronicoListadoModule { }
