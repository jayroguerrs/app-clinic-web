import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaRegistroComponent} from './cita-registro.component';

const routesCitaRegistro: Routes = [
    {
        path: '', component: CitaRegistroComponent,
        children: [ { path: '', component: CitaRegistroComponent  } ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routesCitaRegistro)],
    exports: [RouterModule]
})
export class CitaRegistroRoutingModule { }

