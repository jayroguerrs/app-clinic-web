import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvolucionCitaMensualComponent } from './evolucion-cita-mensual.component';

const routes: Routes = [
    {
        path: '', component: EvolucionCitaMensualComponent,
        children: [
            { path: '', component: EvolucionCitaMensualComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EvolucionCitaMensualRoutingModule { }