import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacturaTipoMonedaComponent} from "./factura-tipo-moneda.component";


const routes: Routes = [{
  path: '',
  component: FacturaTipoMonedaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaTipoMonedaRoutingModule { }
