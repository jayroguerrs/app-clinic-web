import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteElectronicoReporteVentaClienteComponent} from "./comprobante-electronico-reporte-venta-cliente.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteElectronicoReporteVentaClienteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteElectronicoReporteVentaClienteRoutingModule { }
