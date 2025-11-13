import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromocionVistaComponent } from './promocion-vista/promocion-vista.component';

const routes: Routes = [
    {   path: '', component: PromocionVistaComponent,
        children: [
            { path: '', component: PromocionVistaComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModuloPromocionRoutingModule { }