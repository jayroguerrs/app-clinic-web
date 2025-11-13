import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TipoCitaComponent} from "./tipo-cita.component";


const routes: Routes = [{
  path: '',
  component: TipoCitaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCitaRoutingModule { }
