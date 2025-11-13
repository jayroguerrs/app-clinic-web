import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MaquinaMarcaComponent} from "./maquina-marca.component";


const routes: Routes = [{
  path: '',
  component: MaquinaMarcaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaquinaMarcaRoutingModule { }
