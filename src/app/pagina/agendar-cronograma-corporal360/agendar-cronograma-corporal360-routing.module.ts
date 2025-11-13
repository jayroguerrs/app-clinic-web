import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgendarCronogramaCorporal360Component} from "./agendar-cronograma-corporal360.component";


const routes: Routes = [{
  path: '',
  component: AgendarCronogramaCorporal360Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendarCronogramaCorporal360RoutingModule { }
