import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitaReporteComponent} from "./cita-reporte.component";

const routes: Routes = [
    {
        path: '',
        component: CitaReporteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CitaReporteRoutingModule { }
