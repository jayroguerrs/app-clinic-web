import { NgModule } from '@angular/core';
import { PreferenteListadoComponent } from './preferente-listado/preferente-listado.component';
import { PreferenteDatosComponent } from './preferente-datos/preferente-datos.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '', component: PreferenteListadoComponent,
      children: [
          { path: '', component: PreferenteListadoComponent },
          { path: 'add', component: PreferenteDatosComponent },
          { path: 'edit/:id', component: PreferenteDatosComponent }
      ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenteRoutingModule { }
