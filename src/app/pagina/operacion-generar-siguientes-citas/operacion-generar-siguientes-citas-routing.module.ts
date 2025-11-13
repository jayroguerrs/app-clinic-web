import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperacionGenerarSiguientesCitasComponent } from './operacion-generar-siguientes-citas.component';


const routes: Routes = [{
  path: '',
  component: OperacionGenerarSiguientesCitasComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionGenerarSiguientesCitasRoutingModule { }
