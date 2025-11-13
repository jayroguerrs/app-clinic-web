import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {ReactiveFormsModule} from "@angular/forms";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {LoaderCircleModule} from "../../../componentes/loading/loader/loader-circle/loader-circle.module";
import {DisableControlModule} from "../../../shared/directive/disable-control/disable-control.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MdlPdfGoogleViewModule} from "../../../componentes/modals/mdl-pdf-google-view/mdl-pdf-google-view.module";
import {TblComprobanteAnulacionesModule} from "../../../componentes/tables/facturacion/tbl-comprobante-anulaciones/tbl-comprobante-anulaciones.module";
import {ComprobanteElectronicoAnulacionComponent} from "./comprobante-electronico-anulacion.component";
import {ComprobanteElectronicoAnulacionRoutingModule} from "./comprobante-electronico-anulacion-routing.module";

@NgModule({
  declarations: [ComprobanteElectronicoAnulacionComponent],
  imports: [
    CommonModule,
    ComprobanteElectronicoAnulacionRoutingModule,
    NgbTooltipModule,
    MatRippleModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    LoaderCircleModule,
    DisableControlModule,
    MatProgressBarModule,
    MdlPdfGoogleViewModule,
    TblComprobanteAnulacionesModule
  ],
  exports: [ComprobanteElectronicoAnulacionComponent],
  providers: [],
  bootstrap: [ComprobanteElectronicoAnulacionComponent]
})
export class ComprobanteElectronicoAnulacionModule { }
