import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PromocionRankingVentasComponent} from "./promocion-ranking-ventas.component";


const routes: Routes = [{
  path: '',
  component: PromocionRankingVentasComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromocionRankingVentasRoutingModule { }
