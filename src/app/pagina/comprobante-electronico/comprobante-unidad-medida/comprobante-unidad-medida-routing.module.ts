import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteUnidadMedidaComponent} from "./comprobante-unidad-medida.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteUnidadMedidaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteUnidadMedidaRoutingModule { }
