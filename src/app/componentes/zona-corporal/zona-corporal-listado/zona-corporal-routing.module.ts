import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZonaCorporalListadoComponent } from './zona-corporal-listado.component';
import { ZonaCorporalDatosComponent } from '../zona-corporal-datos/zona-corporal-datos.component';


const routes: Routes = [
    {
        path: '', component:  ZonaCorporalListadoComponent,
        children: [
            { path: '', component: ZonaCorporalListadoComponent },
            { path: 'add', component: ZonaCorporalDatosComponent },
            { path: 'edit/:id', component: ZonaCorporalDatosComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ZonaCorporalRoutingModule { }