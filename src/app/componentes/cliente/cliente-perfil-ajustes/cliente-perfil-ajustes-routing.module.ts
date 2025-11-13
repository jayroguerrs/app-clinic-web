import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilAjustesComponent} from "./cliente-perfil-ajustes.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilAjustesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilAjustesRoutingModule { }
