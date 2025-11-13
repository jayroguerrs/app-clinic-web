import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilListadoComponent } from './perfil-listado.component';

const routes: Routes = [
    {
        path: '', component: PerfilListadoComponent,
        children: [
            { path: '', component: PerfilListadoComponent  },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PerfilListadoRoutingModule { }