import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PreferenteEstadoComponent} from "./preferentes-estado.component";


const routes: Routes = [{
  path: '',
  component: PreferenteEstadoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenteEstadoRoutingModule { }
