import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitaReporteDetalladoComponent} from "./cita-reporte-detallado.component";

const routes: Routes = [
    {
        path: '',
        component: CitaReporteDetalladoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CitaReporteDetalladoRoutingModule { }
