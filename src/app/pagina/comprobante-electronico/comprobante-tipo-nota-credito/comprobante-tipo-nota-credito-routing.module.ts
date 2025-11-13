import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComprobanteTipoNotaCreditoComponent } from './comprobante-tipo-nota-credito.component';


const routes: Routes = [{
  path: '',
  component: ComprobanteTipoNotaCreditoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteTipoNotaCreditoRoutingModule { }
