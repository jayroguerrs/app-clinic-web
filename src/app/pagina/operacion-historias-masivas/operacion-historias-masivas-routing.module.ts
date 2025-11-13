import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperacionHistoriasMasivasComponent } from './operacion-historias-masivas.component';


const routes: Routes = [{
  path: '',
  component: OperacionHistoriasMasivasComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionHistoriasMasivasRoutingModule { }
