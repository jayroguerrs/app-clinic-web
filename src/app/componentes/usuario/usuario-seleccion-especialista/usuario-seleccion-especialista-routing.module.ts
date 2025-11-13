import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsuarioSeleccionEspecialistaComponent} from "./usuario-seleccion-especialista.component";
const routes: Routes = [
    {
        path: '', component: UsuarioSeleccionEspecialistaComponent,
        children: [ { path: '', component: UsuarioSeleccionEspecialistaComponent  }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioSeleccionEspecialistaRoutingModule { }
