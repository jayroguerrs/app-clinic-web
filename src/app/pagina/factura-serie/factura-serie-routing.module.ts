import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturaSerieComponent } from './factura-serie.component';


const routes: Routes = [{
  path: '',
  component: FacturaSerieComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaSerieRoutingModule { }
