import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CasoComponent} from "./caso.component";


const routes: Routes = [{
  path: '',
  component: CasoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasoRoutingModule { }
