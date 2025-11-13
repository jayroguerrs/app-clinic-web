import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlDeCitasComponent } from './control-de-citas.component';

const routes: Routes = [{
  path: '',
  component: ControlDeCitasComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlDeCitasRoutingModule { }
