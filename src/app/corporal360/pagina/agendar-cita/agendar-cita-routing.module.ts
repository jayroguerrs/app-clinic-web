import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgendarCitaComponent} from "./agendar-cita.component";

const routes: Routes = [{
  path: '',
  component: AgendarCitaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendarCitaRoutingModule { }
