import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromocionListadoComponent } from './promocion-listado/promocion-listado.component';
import { PromocionDatosComponent } from './promocion-datos/promocion-datos.component';

const routes: Routes = [
    {   path: '', component: PromocionListadoComponent,
        children: [
            { path: '', component: PromocionListadoComponent },
            { path: 'add', component: PromocionDatosComponent },
            { path: 'edit/:id', component: PromocionDatosComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromocionRoutingModule { }