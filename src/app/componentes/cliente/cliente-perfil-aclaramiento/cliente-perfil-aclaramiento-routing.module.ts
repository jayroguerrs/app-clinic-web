import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilAclaramientoComponent} from "./cliente-perfil-aclaramiento.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilAclaramientoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilAclaramientoRoutingModule { }
