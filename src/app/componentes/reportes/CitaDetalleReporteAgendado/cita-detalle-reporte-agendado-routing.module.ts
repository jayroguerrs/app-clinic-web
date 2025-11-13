import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitaDetalleReporteAgendadoComponent} from "./cita-detalle-reporte-agendado.component";

const routes: Routes = [
    {
        path: '',
        component: CitaDetalleReporteAgendadoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CitaDetalleReporteAgendadoRoutingModule { }
