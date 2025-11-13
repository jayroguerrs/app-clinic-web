import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlantillaComponent} from "./plantilla.component";


const routes: Routes = [{
  path: '',
  component: PlantillaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantillaRoutingModule { }
