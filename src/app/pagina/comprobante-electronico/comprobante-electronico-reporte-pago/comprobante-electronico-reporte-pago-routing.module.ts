import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteElectronicoReportePagoComponent} from "./comprobante-electronico-reporte-pago.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteElectronicoReportePagoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteElectronicoReportePagoRoutingModule { }
