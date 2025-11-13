import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CajaDatosComponent } from './caja-datos/caja-datos.component';
import { CajaListadoComponent } from './caja-listado/caja-listado.component';
import { CajaPosComponent } from './caja-pos/caja-pos.component';


const routes: Routes = [
    {path: 'Pos', component: CajaPosComponent},
    {
        path: '', component: CajaListadoComponent,        
        children: [
             { path: '', component: CajaListadoComponent  },
             { path: 'registro/editar', component: CajaDatosComponent },
             { path: 'registro/editar/:id', component: CajaDatosComponent },                           
                ]
    }   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CajaRoutingModule { }