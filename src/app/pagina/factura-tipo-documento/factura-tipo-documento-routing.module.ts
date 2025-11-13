import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacturaTipoDocumentoComponent} from "./factura-tipo-documento.component";


const routes: Routes = [{
  path: '',
  component: FacturaTipoDocumentoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaTipoDocumentoRoutingModule { }
