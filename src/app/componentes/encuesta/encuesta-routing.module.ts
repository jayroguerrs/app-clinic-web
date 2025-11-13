import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EncuestaComponent} from "./encuesta.component";


const routes: Routes = [{
 path: '',
 component: EncuestaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncuestaRoutingModule { }
