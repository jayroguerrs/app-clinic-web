import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilDermatologiaComponent} from "./cliente-perfil-dermatologia.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilDermatologiaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilDermatologiaRoutingModule { }
