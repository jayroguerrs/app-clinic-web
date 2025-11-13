import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteNotaCreditoComponent} from "./comprobante-nota-credito.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteNotaCreditoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteNotaCreditoRoutingModule { }
