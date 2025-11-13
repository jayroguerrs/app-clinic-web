import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncidenciaListadoComponent } from './incidencia-listado/incidencia-listado.component'

const routes: Routes = [
    {
        path: '', component: IncidenciaListadoComponent,
        children: [
            { path: '', component: IncidenciaListadoComponent },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IncidenciaRoutingModule { }