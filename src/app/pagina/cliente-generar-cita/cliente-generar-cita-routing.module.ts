import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteGenerarCitaComponent} from "./cliente-generar-cita.component";


const routes: Routes = [{
  path: '',
  component: ClienteGenerarCitaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteGenerarCitaRoutingModule { }
