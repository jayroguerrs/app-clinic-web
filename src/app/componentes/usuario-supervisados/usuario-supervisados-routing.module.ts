import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioSupervisadosComponent } from '../usuario/usuario-supervisados/usuario-supervisados.component';


const routes: Routes = [
  {
      path: '', component: UsuarioSupervisadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioSupervisadosRoutingModule { }
