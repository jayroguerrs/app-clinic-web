import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PreferentesRedesComponent} from "./preferentes-redes.component";


const routes: Routes = [{
  path: '',
  component: PreferentesRedesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferentesRedesRoutingModule { }
