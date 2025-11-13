import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZonaCorporalSeleccionarComponent } from './zona-corporal-seleccionar.component';

const routes: Routes = [
    {
        path: '', component: ZonaCorporalSeleccionarComponent,
        children: [
            { path: '', component: ZonaCorporalSeleccionarComponent },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ZonaCorporalSeleccionarRoutingModule { }