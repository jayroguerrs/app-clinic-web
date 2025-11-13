import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitasAbandonadasAsignacionComponent} from "./citas-abandonadas-asignacion.component";
const routesCitaListado: Routes = [
    {
    path: '', component: CitasAbandonadasAsignacionComponent,
    children:
        [
            { path: '', component: CitasAbandonadasAsignacionComponent  }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class CitasAbandonadasAsignacionRoutingModule { }
