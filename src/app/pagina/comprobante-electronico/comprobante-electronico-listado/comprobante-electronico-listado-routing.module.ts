import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteElectronicoListadoComponent} from "./comprobante-electronico-listado.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteElectronicoListadoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteElectronicoListadoRoutingModule { }
