import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TratamientoComponent} from "./tratamiento.component";


const routes: Routes = [{
  path: '',
  component: TratamientoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TratamientoRoutingModule { }
