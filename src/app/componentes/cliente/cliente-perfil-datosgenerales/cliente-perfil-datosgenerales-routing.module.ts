import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientePerfilDatosgeneralesComponent} from "./cliente-perfil-datosgenerales.component";


const routes: Routes = [{
  path: '',
  component: ClientePerfilDatosgeneralesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePerfilDatosgeneralesRoutingModule { }
