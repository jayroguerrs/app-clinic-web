import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteAsignacionComponent} from "./cliente-asignacion.component";
const routesCitaListado: Routes = [
    {
    path: '', component: ClienteAsignacionComponent,
    children:
        [
            { path: '', component: ClienteAsignacionComponent  }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class ClienteAsignacionRoutingModule { }
