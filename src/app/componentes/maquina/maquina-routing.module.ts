import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaquinaListadoComponent } from './maquina-listado/maquina-listado.component';
import { MaquinaDatosComponent } from './maquina-datos/maquina-datos.component';

const routes: Routes = [
    {
        path: '', component: MaquinaListadoComponent,
        children: [
            { path: '', component: MaquinaListadoComponent },
            { path: 'editar', component: MaquinaDatosComponent },
            { path: 'editar/:id', component: MaquinaDatosComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaquinaRoutingModule { }