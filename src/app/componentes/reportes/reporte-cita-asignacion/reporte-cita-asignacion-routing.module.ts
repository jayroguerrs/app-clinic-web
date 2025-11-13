import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReporteCitaAsignacionComponent} from "./reporte-cita-asignacion.component";
const routesCitaListado: Routes = [
    {
    path: '', component: ReporteCitaAsignacionComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class ReporteCitaAsignacionRoutingModule { }
