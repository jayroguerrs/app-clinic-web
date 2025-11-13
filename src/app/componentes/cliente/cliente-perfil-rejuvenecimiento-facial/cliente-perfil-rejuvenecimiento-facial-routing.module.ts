import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilRejuvenecimientoFacialComponent} from "./cliente-perfil-rejuvenecimiento-facial.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilRejuvenecimientoFacialComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilRejuvenecimientoFacialRoutingModule { }
