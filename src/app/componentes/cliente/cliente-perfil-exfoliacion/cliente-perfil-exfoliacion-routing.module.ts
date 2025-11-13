import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilExfoliacionComponent} from "./cliente-perfil-exfoliacion.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilExfoliacionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilExfoliacionRoutingModule { }
