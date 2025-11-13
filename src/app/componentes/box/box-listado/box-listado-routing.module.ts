import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoxListadoComponent } from './box-listado.component';


const routes: Routes = [
  {
    path: '', component: BoxListadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoxListadoRoutingModule { }