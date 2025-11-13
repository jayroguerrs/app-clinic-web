import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SedeDatosComponent } from './sede-datos/sede-datos.component';
import { SedeListadoComponent } from './sede-listado/sede-listado.component';

const routes: Routes = [
    {
        path: '', component: SedeListadoComponent,
        children: [
            { path: '', component: SedeListadoComponent },
            { path: 'add', component: SedeDatosComponent },
            { path: 'edit/:id', component: SedeDatosComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SedeRoutingModule { }