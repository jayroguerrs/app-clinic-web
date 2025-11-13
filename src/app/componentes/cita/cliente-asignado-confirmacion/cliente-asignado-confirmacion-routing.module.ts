import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteAsignadoConfirmacionComponent} from "./cliente-asignado-confirmacion.component";
const routesCitaListado: Routes = [
    {
    path: '', component: ClienteAsignadoConfirmacionComponent,
    children:
        [
            { path: '', component: ClienteAsignadoConfirmacionComponent  }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class ClienteAsignadoConfirmacionRoutingModule { }
