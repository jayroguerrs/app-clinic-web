import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComprobanteTipoNotaDebitoComponent } from './comprobante-tipo-nota-debito.component';


const routes: Routes = [{
  path: '',
  component: ComprobanteTipoNotaDebitoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteTipoNotaDebitoRoutingModule { }
