import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioSeleccionComponent } from './usuario-seleccion.component'
const routes: Routes = [
    {
        path: '', component: UsuarioSeleccionComponent,
        children: [ { path: '', component: UsuarioSeleccionComponent  }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioSeleccionRoutingModule { }