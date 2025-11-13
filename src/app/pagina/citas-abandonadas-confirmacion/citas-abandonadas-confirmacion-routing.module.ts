import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitasAbandonadasConfirmacionComponent} from "./citas-abandonadas-confirmacion.component";
const routesCitaListado: Routes = [
    {
    path: '', component: CitasAbandonadasConfirmacionComponent,
    children:
        [
            { path: '', component: CitasAbandonadasConfirmacionComponent  }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class CitasAbandonadasConfirmacionRoutingModule { }
