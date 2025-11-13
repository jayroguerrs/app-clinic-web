import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoComprobanteDatosComponent } from './tipo-comprobante-datos/tipo-comprobante-datos.component';
import { TipoComprobanteListadoComponent } from './tipo-comprobante-listado/tipo-comprobante-listado.component';

const routes: Routes = [
    {
        path: '', component: TipoComprobanteListadoComponent,
        children: [
             { path: '', component: TipoComprobanteListadoComponent  },
             { path: 'registro/editar', component: TipoComprobanteDatosComponent },
             { path: 'registro/editar/:id', component: TipoComprobanteDatosComponent }        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TipoComprobanteRoutingModule { }