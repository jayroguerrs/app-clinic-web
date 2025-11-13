import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaAsignacionComponent } from './cita-asignacion.component';
const routesCitaListado: Routes = [
    {
    path: '', component: CitaAsignacionComponent,
    children: 
        [ 
            { path: '', component: CitaAsignacionComponent  }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class CitaAsignacionRoutingModule { }