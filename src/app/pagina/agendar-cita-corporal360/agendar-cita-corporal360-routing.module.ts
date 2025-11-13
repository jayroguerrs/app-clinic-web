import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgendarCitaCorporal360Component} from "./agendar-cita-corporal360.component";


const routes: Routes = [{
  path: '',
  component: AgendarCitaCorporal360Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendarCitaCorporal360RoutingModule { }
