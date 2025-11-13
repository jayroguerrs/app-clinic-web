import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoCitaListadoComponent } from './tipo-cita-listado/tipo-cita-listado.component';
import { TipoCitaDatosComponent } from './tipo-cita-datos/tipo-cita-datos.component';

const routes: Routes = [
    {
        path: '', component: TipoCitaListadoComponent,
        children: [
            { path: '', component: TipoCitaListadoComponent },
            { path: 'add', component: TipoCitaDatosComponent  },
            { path: 'edit/:id', component: TipoCitaDatosComponent  }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TipoCitaRoutingModule { }