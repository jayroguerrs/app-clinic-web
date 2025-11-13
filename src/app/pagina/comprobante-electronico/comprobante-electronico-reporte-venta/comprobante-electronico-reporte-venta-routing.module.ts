import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteElectronicoReporteVentaComponent} from "./comprobante-electronico-reporte-venta.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteElectronicoReporteVentaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteElectronicoReporteVentaRoutingModule { }
