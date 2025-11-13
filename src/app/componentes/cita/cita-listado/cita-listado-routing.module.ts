import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaListadoComponent } from './cita-listado.component';
import { CitaRegistroComponent } from '../cita-registro/cita-registro.component';
import { CitaCondicionEstadoComponent } from '../cita-condicion-estado/cita-condicion-estado.component';
const routesCitaListado: Routes = [
    {
        path: '', component: CitaListadoComponent,
        children: [ 
        { path: '', component: CitaListadoComponent  },
        { path: 'add', component: CitaRegistroComponent },
        { path: 'edit/:id', component: CitaRegistroComponent } ,
        { path: 'condicionEstado', component: CitaCondicionEstadoComponent },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class CitaListadoRoutingModule { }