import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteZonasMenosComponent } from './reportezonasmenos.component';

const routes: Routes = [
    {
        path: '', component: ReporteZonasMenosComponent,
        children: [
             { path: '', component: ReporteZonasMenosComponent  },   ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReporteZonasMinimoRoutingModule { }