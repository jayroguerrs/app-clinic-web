import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModuloPlantillaComponent} from "./modulo-plantilla.component";


const routes: Routes = [{
  path: '',
  component: ModuloPlantillaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloPlantillaRoutingModule { }
