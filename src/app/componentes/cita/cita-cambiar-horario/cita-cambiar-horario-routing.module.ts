import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaCambiarHorarioComponent } from './cita-cambiar-horario.component';



const routesCitaHorario: Routes = [
    {
        path: '', component: CitaCambiarHorarioComponent,
        children: [ { path: '', component: CitaCambiarHorarioComponent }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaHorario)],
    exports: [RouterModule]
})
export class CitaCambiarHorarioRoutingModule { }
