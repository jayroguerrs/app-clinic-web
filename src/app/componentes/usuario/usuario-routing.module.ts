import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioListadoComponent } from './usuario-listado/usuario-listado.component';
import { UsuarioDatosComponent } from './usuario-datos/usuario-datos.component';
import { UsuarioSupervisadosComponent } from './usuario-supervisados/usuario-supervisados.component';

const routes: Routes = [
    {
        path: '', component: UsuarioListadoComponent,
        children: [
            { path: '', component: UsuarioListadoComponent },
            { path: 'add', component: UsuarioDatosComponent },
            { path: 'edit/:id', component: UsuarioDatosComponent },
        ]
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }