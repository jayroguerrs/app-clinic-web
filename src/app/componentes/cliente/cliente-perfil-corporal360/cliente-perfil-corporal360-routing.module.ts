import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilCorporal360Component} from "./cliente-perfil-corporal360.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilCorporal360Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilCorporal360RoutingModule { }
