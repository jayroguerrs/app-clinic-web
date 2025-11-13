import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrincipalDefaultComponent} from '../default/principaldefault.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalDefaultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalDefaultRoutingModule { }
