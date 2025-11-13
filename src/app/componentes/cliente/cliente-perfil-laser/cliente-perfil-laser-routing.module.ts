import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilLaserComponent} from "./cliente-perfil-laser.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilLaserComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilLaserRoutingModule { }
