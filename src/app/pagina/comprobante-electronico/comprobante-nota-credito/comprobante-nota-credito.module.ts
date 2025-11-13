import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComprobanteNotaCreditoComponent} from "./comprobante-nota-credito.component";
import {ComprobanteNotaCreditoRoutingModule} from "./comprobante-nota-credito-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {LoaderCircleModule} from "../../../componentes/loading/loader/loader-circle/loader-circle.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataTablesModule} from "angular-datatables";
import {MdlEmisionNotaCreditoModule} from "../../../componentes/modals/facturacion/mdl-emision-nota-credito/mdl-emision-nota-credito.module";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {MdlPdfGoogleViewModule} from "../../../componentes/modals/mdl-pdf-google-view/mdl-pdf-google-view.module";


@NgModule({
  declarations: [ComprobanteNotaCreditoComponent],
  imports: [
    CommonModule,
    ComprobanteNotaCreditoRoutingModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    LoaderCircleModule,
    MatProgressBarModule,
    DataTablesModule,

    MdlEmisionNotaCreditoModule,
    NgbModalModule,
    MdlPdfGoogleViewModule
  ],
  exports: [ComprobanteNotaCreditoComponent],
  providers: [],
  bootstrap: [ComprobanteNotaCreditoComponent]
})
export class ComprobanteNotaCreditoModule { }
