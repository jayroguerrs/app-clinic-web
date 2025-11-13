import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienterecurrenteComponent } from './clienterecurrente.component';

const routes: Routes = [
    {
        path: '', component: ClienterecurrenteComponent,
        children: [
             { path: '', component: ClienterecurrenteComponent  },
       /*       { path: 'registro/editar/:id', component: RegistrocajaComponent }   */      ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteRecurrenteRoutingModule { }