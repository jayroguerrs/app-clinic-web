import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacturaTokenComponent} from "./factura-token.component";


const routes: Routes = [{
  path: '',
  component: FacturaTokenComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaTokenRoutingModule { }
