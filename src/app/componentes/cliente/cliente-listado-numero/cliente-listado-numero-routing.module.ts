import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteListadoNumeroComponent } from './cliente-listado-numero.component'

const routes: Routes = [
    { path: '', component: ClienteListadoNumeroComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteListadoNumeroRoutingModule { }