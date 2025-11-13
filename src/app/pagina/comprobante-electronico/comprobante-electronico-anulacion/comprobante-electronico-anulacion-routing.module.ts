import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComprobanteElectronicoAnulacionComponent} from "./comprobante-electronico-anulacion.component";


const routes: Routes = [{
  path: '',
  component: ComprobanteElectronicoAnulacionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteElectronicoAnulacionRoutingModule { }
