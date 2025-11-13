import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SalaComponent} from "./sala.component";


const routes: Routes = [{
  path: '',
  component: SalaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaRoutingModule { }
