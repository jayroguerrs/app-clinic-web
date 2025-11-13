import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteElectronicoReporteVentaProductoComponent} from "./comprobante-electronico-reporte-venta-producto.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteElectronicoReporteVentaProductoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteElectronicoReporteVentaProductoRoutingModule { }
