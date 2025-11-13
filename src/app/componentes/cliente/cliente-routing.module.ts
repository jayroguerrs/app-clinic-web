import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteListadoComponent } from './cliente-listado/cliente-listado.component';

const routes: Routes = [
    { path: '', component: ClienteListadoComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteRoutingModule { }