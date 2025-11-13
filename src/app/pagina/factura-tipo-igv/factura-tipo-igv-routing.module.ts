import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacturaTipoIgvComponent} from "./factura-tipo-igv.component";


const routes: Routes = [{
  path: '',
  component: FacturaTipoIgvComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaTipoIgvRoutingModule { }
