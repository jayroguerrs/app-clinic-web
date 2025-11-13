import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaHorarioComponent } from './cita-horario.component';



const routesCitaHorario: Routes = [
    {
        path: '', component: CitaHorarioComponent,
        children: [ { path: '', component: CitaHorarioComponent }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaHorario)],
    exports: [RouterModule]
})
export class CitaHorarioRoutingModule { }