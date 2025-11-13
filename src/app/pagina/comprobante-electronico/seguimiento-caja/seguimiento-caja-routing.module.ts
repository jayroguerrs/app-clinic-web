import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SeguimientoCajaComponent} from "./seguimiento-caja.component";


const routes: Routes = [{
  path: '',
  component: SeguimientoCajaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguimientoCajaRoutingModule { }
