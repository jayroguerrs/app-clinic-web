import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnalisisPotencialVentaComponent} from "./analisis-potencial-venta.component";


const routes: Routes = [{
  path: '',
  component: AnalisisPotencialVentaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalisisPotencialVentaRoutingModule { }
