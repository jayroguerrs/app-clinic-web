import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteCumpleaniosComponent} from "./cliente-cumpleanios.component";


const routes: Routes = [{
  path: '',
  component: ClienteCumpleaniosComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteCumpleaniosRoutingModule { }
