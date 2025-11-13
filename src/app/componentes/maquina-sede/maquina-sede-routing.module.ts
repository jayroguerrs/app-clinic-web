import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaquinaSedeListadoComponent } from './maquina-sede-listado/maquina-sede-listado.component';
import { MaquinaSedeDatosComponent } from './maquina-sede-datos/maquina-sede-datos.component';

const routes: Routes = [
    {
        path: '', component: MaquinaSedeListadoComponent,
        children: [
            { path: '', component: MaquinaSedeListadoComponent },
            { path: 'editar', component: MaquinaSedeDatosComponent },
            { path: 'editar/:id', component: MaquinaSedeDatosComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaquinaSedeRoutingModule { }