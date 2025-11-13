import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EspecialistaAtendidosComponent } from './especialista-atendidos.component';

const routes: Routes = [
    {
        path: '',
        component: EspecialistaAtendidosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EspecialistaAtendidosRoutingModule { }
