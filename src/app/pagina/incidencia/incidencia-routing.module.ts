import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IncidenciaComponent} from "./incidencia.component";


const routes: Routes = [{
  path: '',
  component: IncidenciaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenciaRoutingModule { }
