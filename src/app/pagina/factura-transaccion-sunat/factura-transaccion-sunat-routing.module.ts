import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacturaTransaccionSunatComponent} from "./factura-transaccion-sunat.component";


const routes: Routes = [{
  path: '',
  component: FacturaTransaccionSunatComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaTransaccionSunatRoutingModule { }
