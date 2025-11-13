import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilTratamientoFacialComponent} from "./cliente-perfil-tratamiento-facial.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilTratamientoFacialComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilTratamientoFacialRoutingModule { }
