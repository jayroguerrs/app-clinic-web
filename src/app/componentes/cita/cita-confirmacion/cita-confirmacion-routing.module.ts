import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaConfirmacionComponent } from './cita-confirmacion.component';
const routesCitaListado: Routes = [
    {
    path: '', component: CitaConfirmacionComponent,
    children: 
        [ 
            { path: '', component: CitaConfirmacionComponent  }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaListado)],
    exports: [RouterModule]
})
export class CitaConfirmacionRoutingModule { }