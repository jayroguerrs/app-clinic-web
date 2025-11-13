import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteZonasMaximoComponent } from './reportezonas.component';


const routes: Routes = [
    {
        path: '', component: ReporteZonasMaximoComponent,
        children: [
             { path: '', component: ReporteZonasMaximoComponent  },      ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReporteZonasMaximoRoutingModule { }