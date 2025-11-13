import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ZonaTratamientoComponent} from "./zona-tratamiento.component";


const routes: Routes = [{
  path: '',
  component: ZonaTratamientoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaTratamientoRoutingModule { }
