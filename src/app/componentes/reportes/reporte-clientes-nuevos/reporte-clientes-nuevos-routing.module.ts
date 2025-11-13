import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReporteClientesNuevosComponent} from "./reporte-clientes-nuevos.component";
const routesCitaListado: Routes = [
    {
    path: '', component: ReporteClientesNuevosComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class ReporteClientesNuevosRoutingModule { }
