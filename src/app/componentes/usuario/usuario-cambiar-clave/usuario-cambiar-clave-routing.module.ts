import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioCambiarClaveComponent } from '../usuario-cambiar-clave/usuario-cambiar-clave.component';
const routes: Routes = [
    {
        path: '', component: UsuarioCambiarClaveComponent,
        children: [ { path: '', component: UsuarioCambiarClaveComponent  }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioCambiarClaveRoutingModule { }