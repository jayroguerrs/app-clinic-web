import { NgModule } from '@angular/core';
import { CajaEgresoComponent } from './caja-egreso.component';
import { RouterModule, Routes } from '@angular/router';


const routesEgresoListado: Routes = [
    {
        path: '', component: CajaEgresoComponent,
        children: [
            { path: '', component: CajaEgresoComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routesEgresoListado)],
    exports: [RouterModule]
})
export class CajaEgresoRoutingModule {
    
}